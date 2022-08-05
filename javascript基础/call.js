// obj为this要指向的对象
Function.prototype.myCall = function (obj) {
    // 如果调用该方法的不是函数，报错
    if (typeof this !== "function") {
        return new TypeError("Type Error!");
    }
    // 获取传入的参数，call方法会直接传入参数
    let args = [...arguments].slice(1);
    let result = null; // 存放执行的结果
    obj = obj ? obj : window; // obj没有传入，赋值window
    // this是调用该方法的函数，将其赋值给obj的fun方法
    obj.fun = this;
    // obj调用方法，会将方法中的this指向obj
    result = obj.fun(...args); // 传入参数调用方法，并将结果赋值给result
    delete obj.fun;
    return result;
}