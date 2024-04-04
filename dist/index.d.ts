import { DropRequest, MoveRequest, MoveResponse, PgnDumpRequest, PgnDumpResponse, SituationRequest, SituationResponse, ThreefoldTestRequest, ThreefoldTestResponse } from "./types/common";
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
