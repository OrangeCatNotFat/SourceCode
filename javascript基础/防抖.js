/**
 * 初步防抖函数
*/
function debounce1(fun, time) { // fun是要执行的函数，time是间隔的时间
    let that, args, timer;
    return function () {
        that = this; // 将this赋值给that
        args = arguments; // 将参数赋值给args
        clearTimeout(timer); // 清除当前定时器效果
        timer = setTimeout(function () {
            fun.apply(that, args); // 调用函数
        }, time)
    }
}

/**
 * 让代码可以立即执行
*/
function debounce2(fun, time, immediate) {
    let that, args, timer;
    return function () {
        that = this; // 将this赋值给that
        args = arguments; // 将参数赋值给args
        clearTimeout(timer); // 清除当前定时器效果

        if (immediate) { // 如果设置了立即执行
            // 判断之前定时器是否存在，如果存在就不会立即调用，如果不存在立即调用
            let callNow = !timer;
            if (callNow) fun.apply(that, args); // 立即调用
            // 不管要不要立即执行，都要将time时间之后的定时器置空，因为已经执行过一次了
            timer = setTimeout(function () {
                timer = null;
            }, time)
        } else {
            timer = setTimeout(function () {
                fun.apply(that, args); // 调用函数
            }, time)
        }
    }
}

/**
 * 如果函数有返回值，则为防抖函数增加返回值
*/
function debounce3(fun, time, immediate) {
    let that, args, timer, result;
    return function () {
        that = this; // 将this赋值给that
        args = arguments; // 将参数赋值给args
        clearTimeout(timer); // 清除当前定时器效果

        if (immediate) { // 如果设置了立即执行
            // 判断之前定时器是否存在，如果存在就不会立即调用，如果不存在立即调用
            let callNow = !timer;
            if (callNow) result = fun.apply(that, args); // 立即调用
            // 不管要不要立即执行，都要将time时间之后的定时器置空，因为已经执行过一次了
            timer = setTimeout(function () {
                timer = null;
            }, time)
        } else {
            timer = setTimeout(function () {
                fun.apply(that, args); // 调用函数
            }, time)
        }
        return result;
    }
}

/**
 * 取消防抖
*/
function debounce4(fun, time, immediate) {
    let that, args, timer, result;
    let debounced = function () {
        that = this; // 将this赋值给that
        args = arguments; // 将参数赋值给args
        clearTimeout(timer); // 清除当前定时器效果

        if (immediate) { // 如果设置了立即执行
            // 判断之前定时器是否存在，如果存在就不会立即调用，如果不存在立即调用
            let callNow = !timer;
            if (callNow) result = fun.apply(that, args); // 立即调用
            // 不管要不要立即执行，都要将time时间之后的定时器置空，因为已经执行过一次了
            timer = setTimeout(function () {
                timer = null;
            }, time)
        } else {
            timer = setTimeout(function () {
                fun.apply(that, args); // 调用函数
            }, time)
        }
        return result;
    }
    debounced.cancel = function () {
        clearTimeout(timer); // 清除定时器
        timer = null; // 闭包会导致内存泄露，将其滞空
    }
    return debounced;
}