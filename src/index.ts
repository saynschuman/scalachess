import {
  DropRequest,
  MoveRequest,
  MoveResponse,
  PgnDumpRequest,
  PgnDumpResponse,
  SituationRequest,
  SituationResponse,
  ThreefoldTestRequest,
  ThreefoldTestResponse,
  WorkerMessage,
  GameSituation,
} from "./types/common";

export type { SituationRequest, SituationResponse, GameSituation };

export class ScalaChess {
  private worker: Worker;

  constructor(worker: Worker) {
    this.worker = worker;
    this.init();
  }

  private init(): void {
    this.worker.postMessage({
      topic: "init",
      payload: { variant: "standard" },
    });
  }

  situation(payload: SituationRequest): Promise<SituationResponse> {
    return this.askWorker(this.worker, {
      topic: "situation",
      payload,
      reqid: this.uniqId(),
    });
  }

  private askWorker<A, B>(worker: Worker, msg: WorkerMessage<A>): Promise<B> {
    return new Promise((resolve, reject) => {
      function listen(e: MessageEvent) {
        if (
          e.data.topic === msg.topic &&
          (msg.reqid === undefined || e.data.reqid === msg.reqid)
        ) {
          worker.removeEventListener("message", listen);
          resolve(e.data.payload);
        } else if (
          e.data.topic === "error" &&
          e.data.payload.callerTopic === msg.topic &&
          (msg.reqid === undefined || e.data.reqid === msg.reqid)
        ) {
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

  move(payload: MoveRequest): Promise<MoveResponse> {
    return this.askWorker(this.worker, {
      topic: "move",
      payload,
      reqid: this.uniqId(),
    });
  }

  drop(payload: DropRequest): Promise<MoveResponse> {
    return this.askWorker(this.worker, {
      topic: "drop",
      payload,
      reqid: this.uniqId(),
    });
  }

  threefoldTest(payload: ThreefoldTestRequest): Promise<ThreefoldTestResponse> {
    return this.askWorker(this.worker, { topic: "threefoldTest", payload });
  }

  pgnDump(payload: PgnDumpRequest): Promise<PgnDumpResponse> {
    return this.askWorker(this.worker, { topic: "pgnDump", payload });
  }
}
