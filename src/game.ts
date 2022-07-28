import { Launcher } from "jpgames-game-implementation-pixi";
import { IGame } from "jpgames-game-framework";
import { JakEnPoyGame } from "./code/JakEnPoyGame";

export class GameLauncher extends Launcher {
    constructor() {
        super("JakEnPoy");

        console.log("game launcher");
    }

    protected createGame(name: string): IGame {
        return new JakEnPoyGame(name);
    }
}

new GameLauncher();