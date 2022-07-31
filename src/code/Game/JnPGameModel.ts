import { GameModel, GAME_LOOP_STATES, STATE_ACTIONS } from "jpgames-game-implementation-pixi";
import { assign, createMachine } from "xstate";
import { RESULT_STATE } from "../Components/Results/ResultsModel";
import { RESULT, ResultsModelKey, RockPaperScissorsModelKey, SELECTION, SelectionModelKey } from "../JakEnPoyConstants";

export class JnPGameModel extends GameModel {

    protected _selectionStateSchema: any;
    protected _rockPaperScissorsStateSchema: any;
    protected _resultsStateSchema: any;

    protected _playerHand: SELECTION;
    protected _compHand: SELECTION;
    protected _win: boolean;
    protected _lose: boolean;
    protected _draw: boolean;

    public attachStateSchema(key: string, schema: any): void {
        super.attachStateSchema(key, schema);

        if (key == SelectionModelKey) {
            this._selectionStateSchema = schema;
        }

        if (key == RockPaperScissorsModelKey) {
            this._rockPaperScissorsStateSchema = schema;
        }

        if (key == ResultsModelKey) {
            this._resultsStateSchema = schema;
        }
    }

    public setPlayerHand(hand: SELECTION) {
        this._playerHand = hand;
        console.log("SET PLAYER HAND ", this._playerHand);
    }

    public setCompHand(hand: SELECTION) {
        this._compHand = hand;
    }

    public setWinLoseDraw(win: boolean, lose: boolean, draw: boolean){
        this._win = win;
        this._lose = lose;
        this._draw = draw;
    }

    protected createCoreLoopContext(): any {
        return {
            state: GAME_LOOP_STATES.START,
            win: 0,
            lose: 0,
            draw: 0,
            result: RESULT.DRAW,
            playerHand: SELECTION.ROCK,
            compHand: SELECTION.ROCK
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
                    after: {
                        3000: { target: GAME_LOOP_STATES.START }
                    }
                },
                [GAME_LOOP_STATES.START]: {
                    initial: STATE_ACTIONS.SETUP,
                    states: {
                        [STATE_ACTIONS.SETUP]: {
                            on: {
                                NEXT: STATE_ACTIONS.PROCESS
                            },
                            after: {
                                1000: { target: STATE_ACTIONS.PROCESS }
                            }
                        },
                        [STATE_ACTIONS.PROCESS]: {
                            ...this._selectionStateSchema,
                            onDone: {
                                target: STATE_ACTIONS.END_PROCESS,
                                actions: assign({
                                    playerHand: () => this._playerHand
                                })
                            },
                        },
                        [STATE_ACTIONS.END_PROCESS]: {
                            after: {
                                500: { target: STATE_ACTIONS.COMPLETE }
                            }
                        },
                        [STATE_ACTIONS.COMPLETE]: {
                            type: 'final',
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
                            },
                            after: {
                                1000: { target: STATE_ACTIONS.PROCESS }
                            }
                        },
                        [STATE_ACTIONS.PROCESS]: {
                            ...this._rockPaperScissorsStateSchema,
                            onDone: {
                                target: STATE_ACTIONS.END_PROCESS,
                                actions: assign({
                                    compHand: () => this._compHand
                                })
                            }
                        },
                        [STATE_ACTIONS.END_PROCESS]: {
                            after: {
                                500: { target: STATE_ACTIONS.COMPLETE }
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
                            },
                            after: {
                                100: { target: STATE_ACTIONS.PROCESS }
                            }
                        },
                        [STATE_ACTIONS.PROCESS]: {
                            ...this._resultsStateSchema,
                            onDone: {
                                target: STATE_ACTIONS.END_PROCESS,
                                actions: assign({
                                    win: (context) => (this._win ? context.win + 1 : context.win),
                                    lose: (context) => (this._lose ? context.lose + 1 : context.lose),
                                    draw: (context) => (this._draw ? context.draw + 1 : context.draw),
                                    result: () => this._draw ? RESULT.DRAW : this._win ? RESULT.WIN : RESULT.LOSE,
                                })
                            }
                        },
                        [STATE_ACTIONS.END_PROCESS]: {
                            after: {
                                2000: { target: "ADDITIONAL_END_PROCESS" }
                            }
                        },
                        ["ADDITIONAL_END_PROCESS"]: {
                            after: {
                                1000: { target: STATE_ACTIONS.COMPLETE }
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