import { IModel, IView } from "jpgames-game-framework";
import { ComponentController, GAME_LOOP_STATES, STATE_ACTIONS } from "jpgames-game-implementation-pixi";
import { JnPGameModel } from "../../Game/JnPGameModel";
import { SELECTION } from "../../JakEnPoyConstants";
import { RockPaperScissorsModel, RPS_GAME_STATE } from "./RockPaperScissorsModel";
import { RockPaperScissorsView } from "./RockPaperScissorsView";


export class RockPaperScissorsController extends ComponentController {
    protected _playerHand: SELECTION;
    protected _compHand: SELECTION;

    public init(): void {
        super.init();

        this.componentView.subject.subscribe({
            next: (type) => this.onCompleteState(type)
        });
    }

    public onUpdateGameState(state: any) {
        if (state.context.state == GAME_LOOP_STATES.PLAY) {

            console.log(state.context);

            this._playerHand = state.context.playerHand;
            this._compHand = state.context.compHand;

            console.log("RPS", state.value);
            console.log("RPS", state.context.state);
            if (state.matches(`${GAME_LOOP_STATES.PLAY}.${STATE_ACTIONS.SETUP}`)) {
                console.log("SHOW");
                this.componentView.show();
            }

            if (state.matches(`${GAME_LOOP_STATES.PLAY}.${STATE_ACTIONS.END_PROCESS}`)) {
                console.log("HIDE");
                // this.componentView.hide();
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
                this._compHand = this.randomizeCompHand();
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

    public randomizeCompHand(): SELECTION {
        let values = Object.keys(SELECTION)
        let idx = Math.floor(Math.random() * values.length);
        let randValue = values[idx];

        return SELECTION[randValue];
    }

}