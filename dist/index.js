export class ScalaChess {
    constructor(worker) {
        this.worker = worker;
        this.init();
    }
    init() {
        this.worker.postMessage({
            topic: "init",
            payload: { variant: "standard" },
        });
    }
    situation(payload) {
        return this.askWorker(this.worker, {
            topic: "situation",
            payload,
            reqid: this.uniqId(),
        });
    }
    askWorker(worker, msg) {
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
    uniqId() {
        return String(performance.now());
    }
    move(payload) {
        return this.askWorker(this.worker, {
            topic: "move",
            payload,
            reqid: this.uniqId(),
        });
    }
    drop(payload) {
        return this.askWorker(this.worker, {
            topic: "drop",
            payload,
            reqid: this.uniqId(),
        });
    }
    threefoldTest(payload) {
        return this.askWorker(this.worker, { topic: "threefoldTest", payload });
    }
    pgnDump(payload) {
        return this.askWorker(this.worker, { topic: "pgnDump", payload });
    }
}
