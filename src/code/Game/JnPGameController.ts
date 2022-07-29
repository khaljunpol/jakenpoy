import { IModel, IView } from "jpgames-game-framework";
import { GameController } from "jpgames-game-implementation-pixi";
import { JnPGameModel } from "./JnPGameModel";
import { JnPGameView } from "./JnPGameView";

export class JnPGameController extends GameController {

    protected createModel(name: string): IModel {
        return new JnPGameModel(name);
    }

    protected createView(name: string): IView {
        return new JnPGameView(name);
    }
}