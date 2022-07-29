import { IGameController } from "jpgames-game-framework";
import { Game } from "jpgames-game-implementation-pixi/src/Game/Game";
import { JnPGameController } from "./Game/JnPGameController";

export class JakEnPoyGame extends Game {

    protected createController(name: string): IGameController {
        return new JnPGameController(name);
        
    }

    protected loadAssets(): void {
        this._loader
            .add("scissors", "../assets/scissors.png")
            .add("rock", "../assets/rock.png")
            .add("paper", "../assets/paper.png")
            .load(() => this.onLoadComplete())
    }
}