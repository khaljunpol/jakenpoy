import { GameModel, GAME_LOOP_STATES, STATE_ACTIONS } from "jpgames-game-implementation-pixi";
import { assign, createMachine } from "xstate";

export class JnPGameModel extends GameModel {

    


    protected createGameLoopMachine(name: string): any {

        return createMachine({
            id: name + "Loop",
            initial: GAME_LOOP_STATES.START,
            context: this.createCoreLoopContext(),
            states: {
                [GAME_LOOP_STATES.START]: {
                    initial: STATE_ACTIONS.SETUP,
                    states: {
                        [STATE_ACTIONS.SETUP]: {
                            on: {
                                YES: { target: STATE_ACTIONS.DISPLAY }
                            }
                        },
                        [STATE_ACTIONS.DISPLAY]: {
                            on: {
                                YES: { target: STATE_ACTIONS.COMPLETE }
                            }
                        },
                        [STATE_ACTIONS.COMPLETE]: {
                            type: 'final'
                        }
                    },
                    onDone: {
                        target: GAME_LOOP_STATES.PLAY,
                        actions: assign({
                            // action: () => this.completeStart()
                        })
                    },
                    data: {
                        currentState: (context, event) => context.state
                    }
                },
                [GAME_LOOP_STATES.PLAY]: {
                    initial: STATE_ACTIONS.SETUP,
                    states: {
                        [STATE_ACTIONS.SETUP]: {
                            on: {
                                YES: { target: STATE_ACTIONS.DISPLAY }
                            }
                        },
                        [STATE_ACTIONS.DISPLAY]: {
                            on: {
                                YES: { target: STATE_ACTIONS.COMPLETE }
                            }
                        },
                        [STATE_ACTIONS.COMPLETE]: {
                            type: 'final'
                        }
                    },
                    onDone: {
                        target: GAME_LOOP_STATES.END,
                        actions: assign({
                            action: () => GAME_LOOP_STATES.END
                        })
                    },
                    data: {
                        currentState: (context, event) => context.state
                    }
                },
                [GAME_LOOP_STATES.END]: {
                    initial: STATE_ACTIONS.SETUP,
                    states: {
                        [STATE_ACTIONS.SETUP]: {
                            on: {
                                YES: { target: STATE_ACTIONS.DISPLAY }
                            }
                        },
                        [STATE_ACTIONS.DISPLAY]: {
                            on: {
                                YES: { target: STATE_ACTIONS.COMPLETE }
                            }
                        },
                        [STATE_ACTIONS.COMPLETE]: {
                            type: 'final'
                        }
                    },
                    onDone: {
                        target: GAME_LOOP_STATES.START,
                        actions: assign({
                            action: () => GAME_LOOP_STATES.START
                        })
                    },
                    data: {
                        currentState: (context, event) => context.state
                    }
                },
            },
        });
    }
}