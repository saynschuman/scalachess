import { Color, DestsMap, Key, Role, San, Uci } from "./lichess";
export type VariantKey = "standard" | "chess960" | "antichess" | "fromPosition" | "kingOfTheHill" | "threeCheck" | "atomic" | "horde" | "racingKings" | "crazyhouse";
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
