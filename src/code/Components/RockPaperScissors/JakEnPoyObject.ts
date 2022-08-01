import gsap, { Back } from "gsap";
import { Container, Sprite, Texture } from "pixi.js";

export class JakEnPoyObject extends Container {
    private _targetScale: number;
    protected _sprite: Sprite;


    constructor(spriteName: string, targetScale: number) {
        super();

        this._targetScale = targetScale;

        this._sprite = new Sprite(Texture.from(`assets/${spriteName}.png`));
        this.addChild(this._sprite);

        this._sprite.scale.set(targetScale);
        this._sprite.pivot.set(0.5);
        this._sprite.anchor.set(0.5);

        this.alpha = 1;
        this.position.y = -1000;
    }

    public reset(): void{
        gsap.killTweensOf(this._sprite);
        this.alpha = 1;
        this.position.y = -1000;
    }

    public show(): void {
        let popUp = gsap.timeline();

        popUp.to(this, { alpha: 1, duration: 0.5, y: -200, ease: Back.easeOut.config(1) })
            .to(this, { duration: 0.5, alpha: 0, delay: 0.25 })
    }
}