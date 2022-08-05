Function.prototype.myApply = function (obj) {
    // 调用函数的对象不是函数，报错
    if (typeof this !== "function") {
        return new TypeError("Type Error");
    }
    // 获取参数
    let args = arguments[1], result = null;
    obj = obj ? obj : window; // obj不存在指向window
    obj.fun = this; // 将函数传给obj的fun函数
    result = obj.fun(...args); // 调用函数
    delete obj.fun; // 删除函数
    return result;
}