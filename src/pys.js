const pys = (function () {
    const privateData = {
        events: {},
        /**
         * 触发事件
         * @param {String} event 
         * @param {Object} data 
         */
        emit: function (event, data) {
            if (privateData.events[event]) {
                privateData.events[event].forEach(callback => callback(data));
            }
        }
    };

    return {
        init: function () {
            const classes = [
                "Print"
            ]
            let scripts = []
            for (let i = 0; i < classes.length; i++) {
                const className = classes[i];
                const script = document.createElement('script');
                script.src = `./${className}.js`;
                document.body.appendChild(script);
                script.onload = function () {
                    scripts.push(script);
                    if (scripts.length === classes.length) {
                        privateData.emit('ready');
                    }
                }
                script.onerror = function () {
                    console.error(`加载 ${className} 失败`);
                }
            }
        },
        /**
         * 执行代码
         * @param {String} code 
         */
        run: function (code) {
            privateData.emit('start', code);
        },
        /**
         * 重置
         */
        reset: function () {
            privateData.events = {};
        },
        /**
         * 监听事件
         * @param {String} event 
         * @param {Function} callback 
         */
        on: function (event, callback) {
            if (privateData.events[event] === undefined) {
                privateData.events[event] = [];
            }
            privateData.events[event].push(callback);
        },
    };
})();

globalThis.pys = pys;
pys.this = pys