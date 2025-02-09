const textarea = document.getElementById('textarea');
const result = document.getElementById('result');
textarea.value = `print("Hello World!", 114514)`;
pys.init("/src/");
let isReady = false;
pys.on('ready', () => {
    isReady = true;
})
textarea.addEventListener('input', () => {
});
textarea.addEventListener("contextmenu", (e) => {
    e.preventDefault();
    pys.reset()
    if (!isReady) return;
    init();
    pys.run(textarea.value);
})
function init() {
    pys.on("start", e => {
        result.innerHTML = ""
        console.log(e);
        result.innerHTML += "开始运行Python"
    })
    pys.on("runing", e => {
        console.log(e)
    })
    pys.on("error", e => {
        result.innerHTML += `<div style="color: red;">${e.error} at line${e.line}, code: ${e.code}</div>`
    })
}