const PENDING = "pending"; // 等待
const FULFILLED = "fulfilled"; // 成功
const REJECTED = "rejected"; // 失败

class MyPromise {
    constructor(executor) { // 接收一个执行器
        try {
            executor(this.resolve, this.reject); // 执行器会立即执行
        } catch (e) {
            this.reject(e); // 将错误原因传递给失败回调函数
        }
    }

    status = PENDING; // 状态默认为pending等待
    value = undefined; // 成功之后的值
    reason = undefined; // 失败之后的原因
    successCallback = []; // 成功的回调函数
    failCallback = []; // 失败的回调函数

    resolve = value => { // value是成功之后的值
        if (this.status !== PENDING) return; // 当状态不是等待，直接返回
        this.status = FULFILLED; // 将状态改为成功
        this.value = value; // 将成功的值传递
        // this.successCallback && this.successCallback(this.value); // 如果成功回调存在，则调用
        while (this.successCallback.length) { // 循环执行数组中的回调函数
            this.successCallback.shift()(); // 调用回调函数
        }
    }

    reject = reason => { // reason是失败之后的原因
        if (this.status !== PENDING) return; // 当状态不是等待，直接返回
        this.status = REJECTED; // 将状态改为失败
        this.reason = reason; // 将失败的值传递
        // this.failCallback && this.failCallback(this.reason); // 如果失败回调存在，则调用
        while (this.failCallback.length) { // 循环执行
            this.failCallback.shift()(); // 调用失败回调函数
        }
    }

    then(successCallback, failCallback) { // then方法有两个参数
        // 如果没有传入参数，则将值返回
        successCallback = successCallback ? successCallback : value => value;
        failCallback = failCallback ? failCallback : reason => { throw reason };

        let promise = new MyPromise((resolve, reject) => {
            if (this.status === FULFILLED) { // 成功调用第一个回调函数
                setTimeout(() => { // 变成异步代码，获取promise
                    try {
                        let result = successCallback(this.value);
                        resolvePromise(promise, result, resolve, reject); // 调用方法
                    } catch (e) {
                        reject(e); // 将错误传递到下一个then中
                    }
                }, 0)
            } else if (this.status === REJECTED) { // 失败调用第二个回调函数
                setTimeout(() => {
                    try {
                        let result = failCallback(this.reason);
                        resolvePromise(promise, result, resolve, reject);
                    } catch (e) {
                        reject(e); // 传递错误
                    }
                }, 0)
            } else { // 当状态为等待时，将成功回调和失败回调存储起来
                this.successCallback.push(() => { // 为数组添加成功回调函数
                    setTimeout(() => { // 变成异步代码，获取promise
                        try {
                            let result = successCallback(this.value);
                            resolvePromise(promise, result, resolve, reject); // 调用方法
                        } catch (e) {
                            reject(e); // 将错误传递到下一个then中
                        }
                    }, 0)
                });
                this.failCallback.push(() => { // 为数组添加失败回调函数
                    setTimeout(() => {
                        try {
                            let result = failCallback(this.reason);
                            resolvePromise(promise, result, resolve, reject);
                        } catch (e) {
                            reject(e); // 传递错误
                        }
                    }, 0)
                });
            }
        })
        return promise;
    }

    finally(callBack) {
        return this.then(value => {
            return MyPromise.resolve(callBack()).then(() => value);
        }, reason => {
            return MyPromise.resolve(callBack()).then(() => { throw reason });
        })
    }

    catch(failCallback) {
        return this.then(undefined, failCallback);
    }

    static all(array) {
        let result = []; // 结果数组，用来存放结果
        let index = 0; // 计数器，记录是否执行完成

        return new MyPromise((resolve, reject) => {
            function addData(key, value) { // 将结果添加到结果数组中
                result[key] = value;
                index++;
                if (index === array.length) resolve(result);
            }

            for (let i = 0; i < array.length; i++) {
                let current = array[i]; // 获取当前的值
                if (current instanceof MyPromise) { // 是一个Promise对象
                    // 如果是一个Promise对象，我们首先要执行这个对象
                    // 调用它的then方法，如果成功将结果添加到数组中，失败则传递错误
                    current.then(value => addData(i, value), reason => reject(reason))
                } else { // 是一个普通值
                    addData(i, array[i]); // 普通值直接将结果添加到数组中
                }
            }
        })
    }

    static resolve(value) {
        if (value instanceof MyPromise) return value;
        return new MyPromise(resolve => resolve(value));
    }

    static race(array) {
        return new MyPromise((resolve, reject) => {
            for (let i = 0; i < array.length; i++) {
                Promise.resolve(array[i]).then(value => resolve(value), reason => reject(reason));
            }
        })
    }
}

function resolvePromise(promise, result, resolve, reject) {
    if (promise === result) { // 如果相同，报错
        reject(new TypeError("promise对象循环了"));
        return; // 阻止代码向下执行
    }
    // 通过判断result是不是MyPromise的实例对象来判断是不是Promise对象
    if (result instanceof MyPromise) { // 是Promise对象
        // 调用then方法查看Promise对象的状态
        // 如果成功调用第一个回调函数，如果失败调用第二个回调函数
        result.then(value => resolve(value), reason => reject(reason));
    } else { // 如果是普通值
        resolve(result); // 直接将普通值传递
    }
}