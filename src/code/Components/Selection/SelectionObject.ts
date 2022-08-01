import gsap from "gsap";
import isMobile from "is-mobile";
import { Container, Sprite, Texture } from "pixi.js";
import { Subject } from "rxjs";
import { SELECTION } from "../../Utils/JakEnPoyConstants";

export class SelectionObject extends Container {

    private _name: string;
    private _selectionId: SELECTION;

    protected _spriteBtn: Sprite;
    protected _subject: any;

    public get subject(): any {
        return this._subject
    }

    constructor(spriteName: string, selectionID: SELECTION) {
        super();

        this._name = spriteName;
        this._selectionId = selectionID;

        let sprite: Sprite = new Sprite(Texture.from(`assets/${spriteName}.png`));
        this.addChild(sprite);

        sprite.scale.set(0.2);
        sprite.pivot.set(0.5);
        sprite.anchor.set(0.5);

        this._spriteBtn = sprite;

        this._spriteBtn.buttonMode = true;
        this._spriteBtn.interactive = true;

        this._subject = new Subject<SELECTION>()

        if (isMobile()) {
            this._spriteBtn.on("pointerdown", () => this.onClick());
        }
        else {
            this._spriteBtn.on("click", () => this.onClick());
        }
    }

    public reset(): void{
        gsap.killTweensOf(this._spriteBtn);
        this._spriteBtn.scale.set(0.2);
    }

    private onClick(): void {
        this._subject.next(this._selectionId);

        gsap.to(this._spriteBtn.scale, { duration: 0.5, x: 0.3, y: 0.3 });
    }
}