import { Container, Sprite, Texture } from "pixi.js";
import { SELECTION } from "../../Utils/JakEnPoyConstants";

export class HandObject extends Container {
    private _name: string;
    private _selectedID: SELECTION;

    protected _sprites: Record<string, Sprite>;
    protected _selectedSprite: Sprite;

    constructor(selectedID?: SELECTION) {
        super();

        if (selectedID) {
            this._selectedID = selectedID;
        }
        else {
            selectedID = SELECTION.PAPER;
        }

        this._sprites = {};

        let selection = Object.keys(SELECTION);

        selection.forEach(obj => {
            let newSprite = new Sprite(Texture.from(`assets/${obj.toLowerCase()}.png`));

            if (!this._sprites.hasOwnProperty(SELECTION[obj])) {
                this._sprites[SELECTION[obj]] = newSprite;
            }

            this.addChild(newSprite);

            newSprite.scale.set(0.2);
            newSprite.pivot.set(0.5);
            newSprite.anchor.set(0.5);
            newSprite.visible = false;
        });
    }

    public setSelectedHand(selection: SELECTION) {
        this._selectedID = selection;
    }

    public showInitialPose(): void {
        this.reset();
        this._sprites[SELECTION.ROCK].visible = true;
    }

    public showSelected(): void {
        for (let key in this._sprites) {
            this._sprites[key].visible = false;

            if (key == this._selectedID) {
                this._sprites[key].visible = true;
            }
        }
    }

    public reset(): void {
        for (let key in this._sprites) {
            this._sprites[key].visible = false;
        }
    }


}