import { IGameController } from "jpgames-game-framework";
import { ComponentController } from "jpgames-game-implementation-pixi";
import { Game } from "jpgames-game-implementation-pixi/src/Game/Game";
import { ResultsController } from "./Components/Results/ResultsController";
import { RockPaperScissorsController } from "./Components/RockPaperScissors/RockPaperScissorsController";
import { SelectionController } from "./Components/Selection/SelectionController";
import { JnPGameController } from "./Game/JnPGameController";
import { ResultsModelKey, RockPaperScissorsModelKey, SelectionModelKey } from "./Utils/JakEnPoyConstants";


export class JakEnPoyGame extends Game {

    protected _selectionControlller: SelectionController;
    protected _rockPaperScissorsController: RockPaperScissorsController;
    protected _resultsController: ResultsController;

    public init(): void {
        super.init();

        // Create Selection Controller component
        this._selectionControlller = new SelectionController(this._name, this._controller);
        this.installControllerSchemaToGameLoop(this._selectionControlller, SelectionModelKey);

        // Create Rock Paper Scissors Controller component
        this._rockPaperScissorsController = new RockPaperScissorsController(this._name, this._controller);
        this.installControllerSchemaToGameLoop(this._rockPaperScissorsController, RockPaperScissorsModelKey);

        // Create Results Controller component
        this._resultsController = new ResultsController(this._name, this._controller);
        this.installControllerSchemaToGameLoop(this._resultsController, ResultsModelKey);

        // Initialize the game model state data
        // This will create the state machine
        this._controller.init();

        // Subscribe selection controller to the game loop state subject
        this._controller.model.subject.subscribe({ next: (state) => this._selectionControlller.onUpdateGameState(state) });
        this._controller.model.subject.subscribe({ next: (state) => this._rockPaperScissorsController.onUpdateGameState(state) });
        this._controller.model.subject.subscribe({ next: (state) => this._resultsController.onUpdateGameState(state) });

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
            .add("win", "../assets/win.png")
            .add("lose", "../assets/lose.png")
            .add("draw", "../assets/draw.png")
            .add("jak", "../assets/jak.png")
            .add("en", "../assets/en.png")
            .add("poy", "../assets/poy.png")
            .add("logo", "../assets/logo.png")
            .add("select", "../assets/select.png")
            .load(() => this.onLoadComplete())
    }

    protected installControllerSchemaToGameLoop(cont: ComponentController, key: string) {
        // Attach selection controller
        this.addComponent(cont);
        this._controller.gameModel.attachStateSchema(key, cont.componentModel.stateSchema)
    }
}