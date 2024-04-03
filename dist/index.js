const SCALACHESS_URL = "/scalachess.js";
export function tellWorker(worker, topic, payload) {
    if (payload !== undefined) {
        worker.postMessage({ topic, payload });
    }
    else {
        worker.postMessage({ topic });
    }
}
export function askWorker(worker, msg) {
    return new Promise((resolve, reject) => {
        function listen(e) {
            if (e.data.topic === msg.topic &&
                (msg.reqid === undefined || e.data.reqid === msg.reqid)) {
                worker.removeEventListener("message", listen);
                resolve(e.data.payload);
            }
            else if (e.data.topic === "error" &&
                e.data.payload.callerTopic === msg.topic &&
                (msg.reqid === undefined || e.data.reqid === msg.reqid)) {
                worker.removeEventListener("message", listen);
                reject(e.data.payload.error);
            }
        }
        worker.addEventListener("message", listen);
        worker.postMessage(msg);
    });
}
const worker = new Worker(SCALACHESS_URL);
// warmup
worker.postMessage({ topic: "init", payload: { variant: "standard" } });
function uniqId() {
    return String(performance.now());
}
export function init(payload) {
    return askWorker(worker, { topic: "init", payload });
}
export function situation(payload) {
    return askWorker(worker, { topic: "situation", payload, reqid: uniqId() });
}
export function move(payload) {
    return askWorker(worker, { topic: "move", payload, reqid: uniqId() });
}
export function drop(payload) {
    return askWorker(worker, { topic: "drop", payload, reqid: uniqId() });
}
export function threefoldTest(payload) {
    return askWorker(worker, { topic: "threefoldTest", payload });
}
export function pgnDump(payload) {
    return askWorker(worker, { topic: "pgnDump", payload });
}
