import { IModel, IView } from "jpgames-game-framework";
import { ComponentController, GAME_LOOP_STATES, STATE_ACTIONS } from "jpgames-game-implementation-pixi";
import { JnPGameModel } from "../../Game/JnPGameModel";
import { RESULT } from "../../Utils/JakEnPoyConstants";
import { JakEnPoyUtils } from "../../Utils/JakEnPoyUtils";


import { ResultsModel, RESULT_STATE } from "./ResultsModel";
import { ResultsView } from "./ResultsView";

export class ResultsController extends ComponentController {

    private _result: RESULT;

    public init(): void {
        super.init();

        // Subscribe view to main game state
        this.componentView.subject.subscribe({
            next: (type) => this.onCompleteState(type)
        });
    }

    public onUpdateGameState(state: any) {

        // If on End phase
        if (state.context.state == GAME_LOOP_STATES.END) {

            // If on Setup phase
            if (state.matches(`${GAME_LOOP_STATES.END}.${STATE_ACTIONS.SETUP}`)) {

                // Get results from main game context
                let { win, lose, draw } = JakEnPoyUtils.getResults(state.context.playerHand, state.context.compHand);

                // Set result state to model
                this._result = draw ? RESULT.DRAW : win ? RESULT.WIN : RESULT.LOSE,
                    (this._gameController.gameModel as JnPGameModel).setWinLoseDraw(win, lose, draw);

                // Display result
                (this.componentView as ResultsView).showResult(this._result);
            }

            // If on extra END state
            if (state.matches(`${GAME_LOOP_STATES.END}.ADDITIONAL_END_PROCESS`)) {
                // Hide the results panel
                (this.componentView as ResultsView).hideResult().then(() => {
                    this.componentView.hide();
                });
            }
        }
    }

    protected createModel(name: string): IModel {
        return new ResultsModel(name);
    }

    protected createView(name: string): IView {
        return new ResultsView(name);
    }

    protected onCompleteState(state: RESULT_STATE): void {
        switch (state) {
            case RESULT_STATE.PRESENT_START:
                this._gameController.sendAction("DONE_PRESENT_START");
                (this.componentView as ResultsView).onCompleteState(RESULT_STATE.PRESENTED);
                break;

            case RESULT_STATE.PRESENTED:
                this._gameController.sendAction("DONE_PRESENTED");
                (this.componentView as ResultsView).onCompleteState(RESULT_STATE.PRESENT_COMPLETE);
                break;

            case RESULT_STATE.PRESENT_COMPLETE:
                
                break;
        }
    }

    
}