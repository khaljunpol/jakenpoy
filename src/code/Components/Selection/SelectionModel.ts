import { ComponentModel } from "jpgames-game-implementation-pixi";

export enum SELECTION_STATE {
    IDLE = "IDLE",
    SELECTED = "SELECTED"
}

export class SelectionModel extends ComponentModel {

    constructor(name: string) {
        super(name);
    }

    protected createStateContext(): any {
        return null;
    }

    protected createStateSchema(): any {
        return {
            initial: SELECTION_STATE.IDLE,
            states: {
                [SELECTION_STATE.IDLE]: {
                    on: {
                        SELECT: SELECTION_STATE.SELECTED
                    }
                },
                [SELECTION_STATE.SELECTED]: {
                    type: 'final'
                }
            }
        }
    }

    protected createStateMachine(name: string): any {
        return null;
    }

}