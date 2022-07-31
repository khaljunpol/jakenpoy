import { ComponentModel } from "jpgames-game-implementation-pixi";
import { createMachine } from "xstate";
import { SelectionModelKey } from "../../JakEnPoyConstants";

export enum SELECTION_STATE {
    IDLE = "IDLE",
    SELECTED = "SELECTED"
}

export class SelectionModel extends ComponentModel {

    constructor(name: string) {
        super(name);

        console.log(this);
    }

    public get key(): string {
        return "SelectionModel";
    }

    protected createStateContext(): any {
        return {
            state: SELECTION_STATE.IDLE
        }
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

        return createMachine({
            id: SelectionModelKey,
            initial: SELECTION_STATE.IDLE,
            context: this._context,
            ...this._stateSchema
        });
    }

}