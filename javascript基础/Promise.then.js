const PENDING = "pending"; // 等待
const FULFILLED = "fulfilled"; // 成功
const REJECTED = "rejected"; // 失败

class Promise {
    status = PENDING; // 状态为等待态
    value = undefined; // 成功之后的值
    reason = undefined; // 失败之后的值
    successCallback = []; // 存放成功回调函数
    failCallback = []; // 存放失败回调函数

    then(successCallback, failCallback) {
        // 如果没有传入参数，则直接将成功或失败的结果传递下去
        successCallback = successCallback ? successCallback : value => value;
        failCallback = failCallback ? failCallback : reason => { throw reason };

        let promise = new Promise((resolve, reject) => {
            if (this.status === FULFILLED) { // 状态成功了
                setTimeout(() => {
                    try {
                        let result = successCallback(this.value);
                        resolvePromise(result, promise, resolve, reject);
                    } catch (e) {
                        reject(e);
                    }
                }, 0);
            } else if (this.status === REJECTED) { // 状态失败了
                setTimeout(() => {
                    try {
                        let result = failCallback(this.value);
                        resolvePromise(result, promise, resolve, reject);
                    } catch (e) {
                        reject(e);
                    }
                }, 0);
            } else { // 等待态将函数储存起来
                this.successCallback.push(() => {
                    setTimeout(() => {
                        try {
                            let result = successCallback(this.value);
                            resolvePromise(result, promise, resolve, reject);
                        } catch (e) {
                            reject(e);
                        }
                    }, 0);
                })
                this.failCallback.push(() => {
                    setTimeout(() => {
                        try {
                            let result = failCallback(this.value);
                            resolvePromise(result, promise, resolve, reject);
                        } catch (e) {
                            reject(e);
                        }
                    }, 0);
                })
            }
        })
        return promise;
    }
}

function resolvePromise(result, promise, resolve, reject) {
    if (result === promise) { // 如果两个对象相同，报错
        reject(new TypeError("promise循环了"));
        return; // 阻止向下执行
    }
    if (result instanceof Promise) { // 是promise对象就看看结果
        result.then(value => resolve(value), reason => reject(reason));
    } else { // 不是promise对象直接传递下去
        resolve(result);
    }
}