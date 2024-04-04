import { DropRequest, MoveRequest, MoveResponse, PgnDumpRequest, PgnDumpResponse, SituationRequest, SituationResponse, ThreefoldTestRequest, ThreefoldTestResponse, GameSituation } from "./types/common";
export type { SituationRequest, SituationResponse, GameSituation };
export declare class ScalaChess {
    private worker;
    constructor(worker: Worker);
    private init;
    situation(payload: SituationRequest): Promise<SituationResponse>;
    private askWorker;
    uniqId(): string;
    move(payload: MoveRequest): Promise<MoveResponse>;
    drop(payload: DropRequest): Promise<MoveResponse>;
    threefoldTest(payload: ThreefoldTestRequest): Promise<ThreefoldTestResponse>;
    pgnDump(payload: PgnDumpRequest): Promise<PgnDumpResponse>;
}
