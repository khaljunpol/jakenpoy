import { GameView } from "jpgames-game-implementation-pixi";
import { Sprite, Texture } from "pixi.js";

export class JnPGameView extends GameView {

    constructor(name: string) {
        super(name);

        // let sprite: Sprite = new Sprite(Texture.from("assets/rock.png"));
        // this.addChild(sprite);

        // sprite.scale.set(0.1);
        // sprite.pivot.set(0.5);
        // sprite.anchor.set(0.5);

        // console.log(this);
    }

    public onResize(): void {
        super.onResize();

        this.position.x = window.innerWidth / 2;
        this.position.y = window.innerHeight / 2;
    }

}