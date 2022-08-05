Function.prototype.myBind = function (obj) {
    // 如果调用方法的不是函数，报错
    if (typeof this !== "function") {
        return new TypeError("Type Error");
    }
    // 获取参数
    let args = [...arguments].slice(1);
    let fun = this; // 将调用方法的函数赋值给fun
    // 返回一个函数
    return function Fn() {
        return fun.apply(obj, args.concat(...arguments));
    }
}