/**
 * 语法：Object.create(proto, [propertiesObject])
 * 说明：该方法创建一个新对象，新对象的原型(__proto__)是proto，新对象的初始值是propertiesObject
 * 注意：propertiesObject是可选属性，为一个对象，对象中是可枚举属性
 * 示例：
 * var o = Object.create({ name: "张三" }, {
        job: {
            enumerable: true, // 属性是否是可枚举的 默认为false
            writable: true, // 是否是可以修改的 默认为false
            configurable: true, // 属性描述符是否可以重新配置&该属性是否可以删除
            value: "前端" // 该属性的值
        }
    });
 * o的原型是{ name: "张三" }，o为{ job: "前端" }
 */

Object.myObjectCreate = function (proto, propertiesObject = undefined) {
    // typeof 对象 === object，对象为null、数组、对象
    // 如果proto不是null、数组、对象、函数，提示报错
    if (typeof proto !== "object" && typeof proto !== "function") {
        throw new TypeError("Object prototype may only be an Object or null.")
    }
    // 属性propertiesObject不可以穿入null
    if (propertiesObject === null) {
        throw new TypeError("无法将未定义或null转换为对象");
    }
    // 创建函数，将函数的原型设置为proto
    function F() { };
    F.prototype = proto;
    let obj = new F(); // 创建实例对象
    if (propertiesObject !== undefined) { // 不为未定义，则赋值
        Object.defineProperties(obj, propertiesObject);
    }
    if (proto === null) { // 如果proto为null，则它的__proto__属性为null
        obj.__proto__ = null;
    }
    return obj;
}