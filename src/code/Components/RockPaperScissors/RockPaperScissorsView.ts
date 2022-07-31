import { ComponentView } from "jpgames-game-implementation-pixi";
import { PLAYER_TYPE, SELECTION } from "../../JakEnPoyConstants";
import { PlayerObject } from "./PlayerObject";
import { RPS_GAME_STATE } from "./RockPaperScissorsModel";

export class RockPaperScissorsView extends ComponentView {

    protected _playerObject: PlayerObject;
    protected _compObject: PlayerObject;

    constructor(name: string) {
        super(name);

        this._playerObject = new PlayerObject(PLAYER_TYPE.USER);
        this._compObject = new PlayerObject(PLAYER_TYPE.COMP);

        this.addChild(this._playerObject, this._compObject);

        this.onResize();
    }

    public show(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            if (this._isShown)
                return;

            this._playerObject.reset();
            this._compObject.reset();

            super.show();

            Promise.all([
                this._playerObject.enter(),
                this._compObject.enter(),
            ]).then(() => {
                this.onCompleteState(RPS_GAME_STATE.ENTER);
                resolve();
            });
        });
    }

    public hide(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            if (!this._isShown)
                return;

            Promise.all([
                this._playerObject.exit(),
                this._compObject.exit(),
            ]).then(() => {
                // this.onCompleteState(RPS_GAME_STATE.ENTER);
                super.hide();
                resolve();
            });

        });
    }

    public prepare(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            Promise.all([
                this._playerObject.prepare(),
                this._compObject.prepare(),
            ]).then(() => {
                this.onCompleteState(RPS_GAME_STATE.PREPARE);
                resolve();
            });
        });
    }

    public showHand(playerHand: SELECTION, compHand: SELECTION): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            Promise.all([
                this._playerObject.show(playerHand),
                this._compObject.show(compHand),
            ]).then(() => {
                this.onCompleteState(RPS_GAME_STATE.SHOW);
                resolve();
            });
        });
    }

    public showWin(win: boolean) {
        if (win) {
            this._playerObject.win();
        }
        else {
            this._compObject.win();
        }
    }

    public onCompleteState(state: RPS_GAME_STATE): void {
        this._subject.next(state);
    }
}