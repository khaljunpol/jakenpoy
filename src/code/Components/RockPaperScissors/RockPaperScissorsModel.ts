import { ComponentModel } from "jpgames-game-implementation-pixi";

export enum RPS_GAME_STATE {
    ENTER = "ENTER",
    PREPARE = "PREPARE",
    SHOW = "SHOW",
    EXIT = "EXIT"
}
export class RockPaperScissorsModel extends ComponentModel {
    protected createStateContext(): any {
        return null;
    }

    protected createStateSchema(): any {
        return {
            initial: RPS_GAME_STATE.ENTER,
            states: {
                [RPS_GAME_STATE.ENTER]: {
                    on: {
                        DONE_ENTER: RPS_GAME_STATE.PREPARE
                    }
                },
                [RPS_GAME_STATE.PREPARE]: {
                    on: {
                        DONE_PREPARE: RPS_GAME_STATE.SHOW
                    }
                },
                [RPS_GAME_STATE.SHOW]: {
                    on: {
                        DONE_SHOW: RPS_GAME_STATE.EXIT
                    }
                },
                [RPS_GAME_STATE.EXIT]: {
                    type: 'final'
                }
            }
        }
    }

    protected createStateMachine(name: string): any {
        return null;
    }
}