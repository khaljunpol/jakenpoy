import { ComponentModel } from "jpgames-game-implementation-pixi";

export enum RESULT_STATE{
    PRESENT_START = "PRESENT_START",
    PRESENTED = "PRESENTED",
    PRESENT_COMPLETE = "PRESENT_COMPLETE"
}

export class ResultsModel extends ComponentModel{
    protected createStateContext(): any {
        return null;
    }

    protected createStateSchema(): any {
        return {
            initial: RESULT_STATE.PRESENT_START,
            states: {
                [RESULT_STATE.PRESENT_START]: {
                    on: {
                        DONE_PRESENT_START: RESULT_STATE.PRESENTED
                    }
                },
                [RESULT_STATE.PRESENTED]: {
                    on: {
                        DONE_PRESENTED: RESULT_STATE.PRESENT_COMPLETE
                    }
                },
                [RESULT_STATE.PRESENT_COMPLETE]: {
                    type: 'final'
                },
            }
        }
    }

    protected createStateMachine(name: string): any {
        return null;
    }
}