import { IModel, IView } from "jpgames-game-framework";
import { GameController, GAME_LOOP_STATES, STATE_ACTIONS } from "jpgames-game-implementation-pixi";
import { SELECTION_STATE } from "../Components/Selection/SelectionModel";
import { JnPGameModel } from "./JnPGameModel";
import { JnPGameView } from "./JnPGameView";

export class JnPGameController extends GameController {

    protected createModel(name: string): IModel {
        return new JnPGameModel(name);
    }

    protected createView(name: string): IView {
        return new JnPGameView(name);
    }

    public start(): void{
        super.start();
    }   
}