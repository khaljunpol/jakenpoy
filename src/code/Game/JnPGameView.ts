import gsap from "gsap";
import { GameView } from "jpgames-game-implementation-pixi";
import { ScoreObject } from "./ScoreObject";

export class JnPGameView extends GameView {

    private _isShown: boolean;
    protected _scoreObject: ScoreObject;

    constructor(name: string) {
        super(name);

        this._isShown = false;

        this._scoreObject = new ScoreObject();
        this.addChild(this._scoreObject);
    }

    public onResize(): void {
        super.onResize();

        this.position.x = window.innerWidth / 2;
        this.position.y = window.innerHeight / 2;
    }

    public showScore(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            if (this._isShown)
                return;

            this._isShown = true;

            gsap.fromTo(this._scoreObject, { alpha: 0 }, {
                duration: 0.5,
                alpha: 1, onComplete: () => {
                    resolve();
                }
            });
        });
    }

    public updateScore(win: number, lose: number, draw: number): void {
        this._scoreObject.setResult(win, lose, draw);
    }

    public hideScore(): Promise<void> {
        return new Promise<void>((resolve, reject) => {

            if (!this._isShown)
                return;

            this._isShown = false;

            gsap.fromTo(this._scoreObject, { alpha: 1 }, {
                duration: 0.5,
                alpha: 0, onComplete: () => {
                    resolve();
                }
            });
        });
    }

}