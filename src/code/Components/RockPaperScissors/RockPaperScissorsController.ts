import { IModel, IView } from "jpgames-game-framework";
import { ComponentController, GAME_LOOP_STATES, STATE_ACTIONS } from "jpgames-game-implementation-pixi";
import { JnPGameModel } from "../../Game/JnPGameModel";
import { RESULT, SELECTION } from "../../Utils/JakEnPoyConstants";
import { JakEnPoyUtils } from "../../Utils/JakEnPoyUtils";
import { RockPaperScissorsModel, RPS_GAME_STATE } from "./RockPaperScissorsModel";
import { RockPaperScissorsView } from "./RockPaperScissorsView";


export class RockPaperScissorsController extends ComponentController {
    protected _playerHand: SELECTION;
    protected _compHand: SELECTION;

    public init(): void {
        super.init();

        // Subscribe view to main game state
        this.componentView.subject.subscribe({
            next: (type) => this.onCompleteState(type)
        });
    }

    public onUpdateGameState(state: any) {

        // If on Play Phase
        if (state.context.state == GAME_LOOP_STATES.PLAY) {

            // Collect selected hand for player and comp from main game context
            this._playerHand = state.context.playerHand;
            this._compHand = state.context.compHand;

            // Display main container
            if (state.matches(`${GAME_LOOP_STATES.PLAY}.${STATE_ACTIONS.SETUP}`)) {
                this.componentView.show();
            }
        }

        // If on End Phase
        if (state.context.state == GAME_LOOP_STATES.END) {

            // If on End Process phase
            if (state.matches(`${GAME_LOOP_STATES.END}.${STATE_ACTIONS.END_PROCESS}`)) {

                if (state.context.result !== RESULT.DRAW) {
                    // Emphasize the winning hand
                    (this.componentView as RockPaperScissorsView).showWin(state.context.result == RESULT.WIN);
                }
            }

            // Hide/Exit the playing hand
            if (state.matches(`${GAME_LOOP_STATES.END}.ADDITIONAL_END_PROCESS`)) {
                this.componentView.hide();
            }
        }
    }

    protected createModel(name: string): IModel {
        return new RockPaperScissorsModel(name);
    }

    protected createView(name: string): IView {
        return new RockPaperScissorsView(name);
    }

    protected onCompleteState(state: RPS_GAME_STATE): void {
        switch (state) {
            case RPS_GAME_STATE.ENTER:
                this._gameController.sendAction("DONE_ENTER");
                (this.componentView as RockPaperScissorsView).prepare();
                break;

            case RPS_GAME_STATE.PREPARE:
                this._gameController.sendAction("DONE_PREPARE");

                this._compHand = JakEnPoyUtils.randomizeCompHand();
                (this._gameController.gameModel as JnPGameModel).setCompHand(this._compHand);
                (this.componentView as RockPaperScissorsView).showHand(this._playerHand, this._compHand);
                break;

            case RPS_GAME_STATE.SHOW:
                // Continue to exit
                this._gameController.sendAction("DONE_SHOW");
                break;

            case RPS_GAME_STATE.EXIT:
                break;
        }
    }
}