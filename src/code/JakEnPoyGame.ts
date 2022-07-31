import { IGameController } from "jpgames-game-framework";
import { Game } from "jpgames-game-implementation-pixi/src/Game/Game";
import { SelectionController } from "./Components/Selection/SelectionController";
import { JnPGameController } from "./Game/JnPGameController";
import { SelectionModelKey } from "./JakEnPoyConstants";

export class JakEnPoyGame extends Game {

    protected _selectionControlller: SelectionController;

    public init(): void {
        super.init();

        // Create Selection Controller component
        this._selectionControlller = new SelectionController(this._name, this._controller);
        // Attach selection controller
        this.addComponent(this._selectionControlller);
        this._controller.gameModel.attachStateSchema(SelectionModelKey, this._selectionControlller.componentModel.stateSchema)

        // Initialize the game model state data
        // This will create the state machine
        this._controller.init();

        // Subscribe selection controller to the game loop state subject
        this._controller.model.subject.subscribe({ next: (state) => this._selectionControlller.onUpdateGameState(state) });

        this._controller.start();
    }

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