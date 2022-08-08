// fun为构造函数，args为传入的参数
function myNew(fun, ...args) {
    let obj = {};
    obj.__proto__ = fun.prototype;
    fun.apply(obj, args);
    return obj;
}