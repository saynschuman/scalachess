import { Color, DestsMap, Key, Role, San, Uci } from "./types/lichess";

const SCALACHESS_URL = "./scalachess.js";

export type VariantKey =
  | "standard"
  | "chess960"
  | "antichess"
  | "fromPosition"
  | "kingOfTheHill"
  | "threeCheck"
  | "atomic"
  | "horde"
  | "racingKings"
  | "crazyhouse";

export interface Variant {
  readonly key: VariantKey;
  readonly name: string;
  readonly short: string;
  readonly title?: string;
}

export interface GameStatus {
  readonly id: number;
  readonly name: string;
}

export interface CheckCount {
  white: number;
  black: number;
}

export interface Pocket {
  readonly queen: number;
  readonly rook: number;
  readonly knight: number;
  readonly bishop: number;
  readonly pawn: number;
  readonly [role: string]: number;
}

export type Pockets = [Pocket, Pocket];

export interface WorkerMessage<T> {
  topic: string;
  payload?: T;
  reqid?: string;
}

export function tellWorker<A>(
  worker: Worker,
  topic: string,
  payload?: A
): void {
  if (payload !== undefined) {
    worker.postMessage({ topic, payload });
  } else {
    worker.postMessage({ topic });
  }
}

export function askWorker<A, B>(
  worker: Worker,
  msg: WorkerMessage<A>
): Promise<B> {
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

const worker = new Worker(SCALACHESS_URL);

// warmup
worker.postMessage({ topic: "init", payload: { variant: "standard" } });

export interface GameSituation {
  readonly id: string;
  readonly ply: number;
  readonly variant: string;
  readonly fen: string;
  readonly player: Color;
  readonly dests: DestsMap;
  readonly drops?: ReadonlyArray<string>;
  readonly end: boolean;
  readonly playable: boolean;
  readonly status?: GameStatus;
  readonly winner?: Color;
  readonly check: boolean;
  readonly checkCount?: CheckCount;
  readonly san?: San;
  readonly uci?: Uci;
  readonly pgnMoves: ReadonlyArray<string>;
  readonly uciMoves: ReadonlyArray<string>;
  readonly promotion?: string;
  readonly crazyhouse?: {
    readonly pockets: Pockets;
  };
}

export interface InitRequest {
  readonly variant: VariantKey;
  readonly fen?: string;
}

export interface InitResponse {
  readonly variant: Variant;
  readonly setup: GameSituation;
}

export interface SituationRequest {
  readonly variant: VariantKey;
  readonly fen: string;
  readonly path?: string;
}

export interface SituationResponse {
  readonly situation: GameSituation;
  readonly path: string;
}

export interface MoveRequest {
  readonly variant: VariantKey;
  readonly fen: string;
  readonly orig: Key;
  readonly dest: Key;
  readonly pgnMoves?: ReadonlyArray<string>;
  readonly uciMoves?: ReadonlyArray<string>;
  promotion?: Role;
  readonly path?: string;
}

export interface MoveResponse {
  readonly situation: GameSituation;
  readonly path?: string;
}

export interface DropRequest {
  readonly variant: VariantKey;
  readonly fen: string;
  readonly pos: Key;
  readonly role: Role;
  readonly pgnMoves?: ReadonlyArray<string>;
  readonly uciMoves?: ReadonlyArray<string>;
  readonly path?: string;
}

export interface ThreefoldTestRequest {
  readonly variant: VariantKey;
  readonly initialFen: string;
  readonly pgnMoves: ReadonlyArray<string>;
}

export interface ThreefoldTestResponse {
  readonly threefoldRepetition: boolean;
  readonly status: GameStatus;
}

export interface PgnDumpRequest {
  readonly variant: VariantKey;
  readonly initialFen: string;
  readonly pgnMoves: ReadonlyArray<string>;
  readonly white?: string;
  readonly black?: string;
  readonly date?: string;
}

export interface PgnDumpResponse {
  readonly pgn: string;
}

function uniqId() {
  return String(performance.now());
}

export function init(payload: InitRequest): Promise<InitResponse> {
  return askWorker(worker, { topic: "init", payload });
}

export function situation(
  payload: SituationRequest
): Promise<SituationResponse> {
  return askWorker(worker, { topic: "situation", payload, reqid: uniqId() });
}

export function move(payload: MoveRequest): Promise<MoveResponse> {
  return askWorker(worker, { topic: "move", payload, reqid: uniqId() });
}

export function drop(payload: DropRequest): Promise<MoveResponse> {
  return askWorker(worker, { topic: "drop", payload, reqid: uniqId() });
}

export function threefoldTest(
  payload: ThreefoldTestRequest
): Promise<ThreefoldTestResponse> {
  return askWorker(worker, { topic: "threefoldTest", payload });
}

export function pgnDump(payload: PgnDumpRequest): Promise<PgnDumpResponse> {
  return askWorker(worker, { topic: "pgnDump", payload });
}
