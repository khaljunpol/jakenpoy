import { GameModel, GAME_LOOP_STATES, STATE_ACTIONS } from "jpgames-game-implementation-pixi";
import { assign, createMachine } from "xstate";
import { SelectionModelKey } from "../JakEnPoyConstants";

export class JnPGameModel extends GameModel {

    protected _selectionStateSchema: any;

    public attachStateSchema(key: string, schema: any): void {
        super.attachStateSchema(key, schema);

        if (key == SelectionModelKey) {
            this._selectionStateSchema = schema;
        }
    }
    protected createGameLoopMachine(name: string): any {

        let idName = name + "Loop"

        return createMachine({
            id: idName,
            initial: GAME_LOOP_STATES.INITIALIZE,
            context: this._gameContext,
            states: {
                [GAME_LOOP_STATES.INITIALIZE]: {
                    on: {
                        START: GAME_LOOP_STATES.START
                    },
                },
                [GAME_LOOP_STATES.START]: {
                    initial: STATE_ACTIONS.SETUP,
                    states: {
                        [STATE_ACTIONS.SETUP]: {
                            on: {
                                NEXT: STATE_ACTIONS.PROCESS
                            },
                        },
                        [STATE_ACTIONS.PROCESS]: {
                            // invoke: {
                            //     id: SelectionModelKey,
                            //     src: this._selectionStateMachine,
                            //     onDone: {
                            //         target: STATE_ACTIONS.COMPLETE,
                            //         actions: assign({
                            //             action: () => console.log("DONE")
                            //         })
                            //     },
                            // },
                            ...this._selectionStateSchema,
                            onDone: {
                                target: STATE_ACTIONS.COMPLETE
                            },
                        },
                        [STATE_ACTIONS.COMPLETE]: {
                            type: 'final'
                        }
                    },
                    onDone: {
                        target: GAME_LOOP_STATES.PLAY,
                        actions: assign({
                            state: GAME_LOOP_STATES.PLAY
                        })
                    }
                },
                [GAME_LOOP_STATES.PLAY]: {
                    initial: STATE_ACTIONS.SETUP,
                    states: {
                        [STATE_ACTIONS.SETUP]: {
                            on: {
                                NEXT: STATE_ACTIONS.PROCESS
                            }
                        },
                        [STATE_ACTIONS.PROCESS]: {
                            on: {
                                NEXT: STATE_ACTIONS.COMPLETE
                            }
                        },
                        [STATE_ACTIONS.COMPLETE]: {
                            type: 'final'
                        }
                    },
                    onDone: {
                        target: GAME_LOOP_STATES.END,
                        actions: assign({
                            state: GAME_LOOP_STATES.END
                        })
                    }
                },
                [GAME_LOOP_STATES.END]: {
                    initial: STATE_ACTIONS.SETUP,
                    states: {
                        [STATE_ACTIONS.SETUP]: {
                            on: {
                                NEXT: STATE_ACTIONS.PROCESS
                            }
                        },
                        [STATE_ACTIONS.PROCESS]: {
                            on: {
                                NEXT: STATE_ACTIONS.COMPLETE
                            }
                        },
                        [STATE_ACTIONS.COMPLETE]: {
                            type: 'final'
                        }
                    },
                    onDone: {
                        target: GAME_LOOP_STATES.START,
                        actions: assign({
                            state: GAME_LOOP_STATES.START
                        })
                    }
                },
            },
        });
    }
}