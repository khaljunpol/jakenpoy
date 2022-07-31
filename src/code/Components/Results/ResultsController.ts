import { IModel, IView } from "jpgames-game-framework";
import { ComponentController, GAME_LOOP_STATES, STATE_ACTIONS } from "jpgames-game-implementation-pixi";
import { JnPGameModel } from "../../Game/JnPGameModel";
import { RESULT, SELECTION } from "../../JakEnPoyConstants";
import { ResultsModel, RESULT_STATE } from "./ResultsModel";
import { ResultsView } from "./ResultsView";

export class ResultsController extends ComponentController {

    private _result: RESULT;

    public init(): void {
        super.init();

        this.componentView.subject.subscribe({
            next: (type) => this.onCompleteState(type)
        });
    }

    public onUpdateGameState(state: any) {
        console.log(state.context);

        if (state.context.state == GAME_LOOP_STATES.END) {

            if (state.matches(`${GAME_LOOP_STATES.END}.${STATE_ACTIONS.SETUP}`)) {

                let { win, lose, draw } = this.getResults(state.context.playerHand, state.context.compHand);
                this._result = draw ? RESULT.DRAW : win ? RESULT.WIN : RESULT.LOSE,
                    (this._gameController.gameModel as JnPGameModel).setWinLoseDraw(win, lose, draw);

                (this.componentView as ResultsView).showResult(this._result);
            }

            if (state.matches(`${GAME_LOOP_STATES.END}.ADDITIONAL_END_PROCESS`)) {
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
                // (this.componentView as ResultsView).hideResult();

                (this.componentView as ResultsView).onCompleteState(RESULT_STATE.PRESENTED);
                break;
            case RESULT_STATE.PRESENTED:
                this._gameController.sendAction("DONE_PRESENTED");
                (this.componentView as ResultsView).onCompleteState(RESULT_STATE.PRESENT_COMPLETE);
                break;
            case RESULT_STATE.PRESENT_COMPLETE:
                // this._gameController.sendAction("NEXT");
                break;
        }
    }

    protected getResults(playerHand: SELECTION, compHand: SELECTION): { win, lose, draw } {
        switch (playerHand + compHand) {
            case 'ROCKSCISSORS':
            case 'PAPERROCK':
            case 'SCISSORSPAPER':
                return { win: true, lose: false, draw: false }
            case 'ROCKPAPER':
            case 'SCISSORSROCK':
            case 'PAPERSCISSORS':
                return { win: false, lose: true, draw: false }
            default:
                return { win: false, lose: false, draw: true }
        }

    }
}