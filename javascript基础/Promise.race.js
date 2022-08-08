class Promise {
    static race(array) {
        return new Promise((resolve, reject) => {
            for (let i = 0; i < array.length; i++) {
                Promise.resolve(array[i]).then(value => resolve(value), reason => reject(reason));
            }
        })
    }
}