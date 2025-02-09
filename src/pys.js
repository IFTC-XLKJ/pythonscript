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
        },
        keywords: [
            "import",
            "print",
            "input",
            "if",
            "elif",
            "else",
            "for",
            "while",
            "def",
            "class",
            "return",
            "break",
            "continue",
            "pass",
            "raise",
            "try",
            "except",
            "finally",
            "assert",
            "global",
            "nonlocal",
        ]
    };

    return {
        /**
         * 初始化
         * @param {String} dirpath 
         */
        init: function (dirpath) {
            const classes = [
                "Print"
            ]
            let scripts = []
            for (let i = 0; i < classes.length; i++) {
                const className = classes[i];
                const script = document.createElement('script');
                script.src = `${dirpath}${className}.js`;
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
        run: async function (code) {
            privateData.emit('start', {
                type: "start",
                code: code,
            });
            await run(code, privateData.emit, privateData.keywords)
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

async function run(code, emit, keywords) {
    return new Promise((resolve, reject) => {
        const codes = code.split("\n")
        codes.forEach((code, index) => {
            emit('runing', {
                type: "runing",
                code: code,
                line: index + 1,
                total: codes.length,
            })
            if (code.trim() === "") {
                return
            }
            const codees = code.split("    ").filter(c => c.trim() !== "")
            try {
                codees.forEach((c, i) => {
                    console.log(c)
                    for (let i = 0; i < keywords.length; i++) {
                        if (c.startsWith(keywords[i])) {
                            let args = handleArgs(c, emit, keywords[i], index + 1, codes.length)
                        }
                    }
                })
            } catch (error) {
                console.log(error)
                emit('error', {
                    type: "error",
                    code: code,
                    line: index + 1,
                    total: codes.length,
                    error: error.message,
                })
            }
        })
    })
}

function getInsideQuotes(str) {
    let insideQuotes = [];
    let insideQuote = false;
    let quoteType = "";
    for (let i = 0; i < str.length; i++) {
        if (str[i] === '"' || str[i] === "'") {
            if (insideQuote) {
                if (str[i] === quoteType) {
                    insideQuote = false;
                    quoteType = "";
                }
            }
        }
    }
    return insideQuotes;
}

String.prototype.startsWith = function (str) {
    return this.indexOf(str) === 0;
};

function handleArgs(str, emit, keyword, line, total) {
    let args = str.replace(keyword, "").trim()
    if (args[0] == "(") {
        if (args.slice(-1) == ")") {
            args = args.slice(1, -1).trim()
            args = args.split(",")
            args.forEach(arg => {
                arg = arg.trim()
                console.log(arg)
            })
            console.log(args)
        } else {
            emit('error', {
                type: "error",
                code: str,
                line: line,
                total: total,
                error: "Unknow ')'",
            })
        }
    } else {
        emit('error', {
            type: "error",
            code: str,
            line: line,
            total: total,
            error: "Unknow '('",
        })
    }
}