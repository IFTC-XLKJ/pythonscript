globalThis.pys = {}
pys.__proto__.run = function() {
}
pys.#events = {}
pys.__proto__.on = function(event, callback) {
    if (pys.#events[event] == undefined) {
        pys.#events[event] = []
    }
    pys.#events[event].push(callback)
}
pys.#emit = function(event, data) {
}

pys.this = pys