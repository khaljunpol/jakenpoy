import { IModel, IView } from "jpgames-game-framework";
import { ComponentController, GAME_LOOP_STATES, STATE_ACTIONS } from "jpgames-game-implementation-pixi";
import { JnPGameModel } from "../../Game/JnPGameModel";
import { SELECTION } from "../../JakEnPoyConstants";
import { SelectionModel } from "./SelectionModel";
import { SelectionView } from "./SelectionView";

export class SelectionController extends ComponentController {

    public init(): void {
        super.init();

        this.componentView.subject.subscribe({
            next: (type) => this.onClickSelection(type)
        });
    }

    public onUpdateGameState(state: any) {
        console.log(state.value);
        if (state.context.state == GAME_LOOP_STATES.START) {
            console.log("SLCT", state.value);
            if (state.matches(`${GAME_LOOP_STATES.START}.${STATE_ACTIONS.SETUP}`)) {
                console.log("SHOW");
                this.componentView.show();
            }

            if (state.matches(`${GAME_LOOP_STATES.START}.${STATE_ACTIONS.END_PROCESS}`)) {
                console.log("HIDE");
                this.componentView.hide();
            }
        }
    }

    protected createModel(name: string): IModel {
        return new SelectionModel(name);
    }

    protected createView(name: string): IView {
        return new SelectionView(name);
    }

    protected onClickSelection(type: SELECTION) {
        (this._gameController.gameModel as JnPGameModel).setPlayerHand(type);

        this._gameController.sendAction("SELECT");
    }
}