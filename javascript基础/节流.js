/**
 * 时间戳实现节流
*/
function throttle1(fun, time) {
    let that, args;
    let old = 0;
    return function () {
        that = this; // 将this赋值给that
        args = arguments; // 将参数赋值给args
        let now = new Date().valueOf(); // 获得当前时间的时间戳
        if (now - old > time) {
            fun.apply(that, args); // 调用函数
            old = now; // 更新旧时间
        }
    }
}

/**
 * 定时器实现节流
*/
function throttle2(fun, time) {
    let that, args, timer;
    return function () {
        that = this;
        args = arguments;
        // 如果定时器不存在，执行函数
        if (!timer) {
            timer = setTimeout(function () {
                fun.apply(that, args);
            }, time)
        }
    }
}

/**
 * 定时器和时间戳组合实现
*/
function throttle3(fun, time) {
    let that, args, timer;
    let old = 0;
    return function () {
        that = this;
        args = arguments;
        // 时间戳
        let now = new Date().valueOf();
        if (now - old > time) { // 间隔时间大于time，执行函数，更新旧时间戳
            fun.apply(that, args);
            old = now;
            if (timer) {
                clearTimeout(timer); // 当执行时间戳防抖函数时，取消定时器的防抖函数
                timer = null;
            }
        }
        // 定时器
        if (!timer) { // 如果当前定时器不存在，执行函数
            timer = setTimeout(function () {
                timer = null;
                fun.apply(that, args);
                old = new Date().valueOf(); // 定时器内执行一次，更新旧时间戳
            }, time)
        }
    }
}