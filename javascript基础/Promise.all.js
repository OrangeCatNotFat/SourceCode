class Promise {
    static all(array) {
        let result = [];
        let index = 0;
        return new Promise((resolve, reject) => {
            function addData(key, value) {
                result[key] = value;
                index++; // 计数
                if (index === array.length) {
                    resolve(result); // 将结果传递出去
                }
            }
            for (let i = 0; i < array.length; i++) {
                let current = array[i]; // 获取当前的值
                if (current instanceof Promise) {
                    current.then(value => addData(i, value), reason => reject(reason));
                } else { // 如果是一个普通值
                    addData(i, current);
                }
            }
        })
    }
}