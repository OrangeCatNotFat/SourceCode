function myInstanceOf(left, right) {
    // left必须为引用数据类型
    if (typeof left !== "object" || left === null) {
        return false;
    }
    // rught必须是构造函数
    if (typeof right !== "function") {
        return new TypeError("right must be function");
    }
    // 相当于proto = left.__proto__
    let proto = Object.getPrototypeOf(left);
    let prototype = right.prototype; // 获取构造函数的原型
    while (proto) {
        if (proto === prototype) return true;
        proto = Object.getPrototypeOf(proto);
    }
}