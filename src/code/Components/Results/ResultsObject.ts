import gsap, { Back } from "gsap";
import { Container, Sprite, Texture } from "pixi.js";
import { RESULT } from "../../JakEnPoyConstants";

export class ResultsObject extends Container {
    private _name: string;
    private _decisionID: RESULT;

    protected _sprites: Record<string, Sprite>;
    protected _selectedSprite: Sprite;

    constructor(resultId?: RESULT) {
        super();

        if (resultId) {
            this._decisionID = resultId;
        }
        else {
            this._decisionID = RESULT.DRAW;
        }

        this._sprites = {};
        this.scale.set(1);
        this.position.y = -200

        let selection = Object.keys(RESULT);

        selection.forEach(obj => {
            let newSprite = new Sprite(Texture.from(`assets/${obj.toLowerCase()}.png`));

            if (!this._sprites.hasOwnProperty(RESULT[obj])) {
                this._sprites[RESULT[obj]] = newSprite;
            }

            this.addChild(newSprite);

            newSprite.scale.set(1);
            newSprite.pivot.set(0.5);
            newSprite.anchor.set(0.5);

            newSprite.visible = false;
        });
    }

    public setResult(decision: RESULT) {
        this._decisionID = decision;
    }

    public showResult(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            gsap.fromTo(this, 1, { alpha: 0 }, {
                alpha: 1,
                ease: Back.easeOut.config(2),
                onComplete: () => {
                    resolve();
                }
            }).delay(0.5);
        });
    }

    public hideResult(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            gsap.fromTo(this, 1, { alpha: 1 }, {
                alpha: 0,
                ease: Back.easeOut.config(2),
                onComplete: () => {
                    resolve();
                }
            });
        });
    }

    public showSelected(): void {
        for (let key in this._sprites) {
            this._sprites[key].visible = false;

            if (key == this._decisionID) {
                this._sprites[key].visible = true;
            }
        }

        console.log(this._sprites[this._decisionID]);

    }

    public reset(): void {
        for (let key in this._sprites) {
            this._sprites[key].visible = false;
        }
    }


}