import { IModel, IView } from "jpgames-game-framework";
import { GameController, GAME_LOOP_STATES, STATE_ACTIONS } from "jpgames-game-implementation-pixi";
import { JnPGameModel } from "./JnPGameModel";
import { JnPGameView } from "./JnPGameView";

export class JnPGameController extends GameController {

    public init(): void {
        super.init();

        this.model.subject.subscribe({
            next: (type) => this.onUpdateGameState(type)
        });
    }

    protected createModel(name: string): IModel {
        return new JnPGameModel(name);
    }

    protected createView(name: string): IView {
        return new JnPGameView(name);
    }

    public sendAction(action: string): void {
        super.sendAction(action);
    }

    public onUpdateGameState(state: any) {

        if (state.context.state == GAME_LOOP_STATES.END) {
            if (state.matches(`${GAME_LOOP_STATES.END}.${STATE_ACTIONS.SETUP}`)) {
                (this.view as JnPGameView).showScore();
            }

            if (state.matches(`${GAME_LOOP_STATES.END}.${STATE_ACTIONS.END_PROCESS}`)) {
                let { win, lose, draw } = state.context;
                (this.view as JnPGameView).updateScore(win, lose, draw);
            }
        }

        if (state.context.state == GAME_LOOP_STATES.START) {
            if (state.matches(`${GAME_LOOP_STATES.START}.${STATE_ACTIONS.SETUP}`)) {
                (this.view as JnPGameView).hideScore();
            }
        }
    }
}