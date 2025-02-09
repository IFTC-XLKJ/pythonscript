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
        /**
         * 执行代码
         * @param {String} code 
         */
        run: function (code) {
            privateData.emit('start', code);
        },
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