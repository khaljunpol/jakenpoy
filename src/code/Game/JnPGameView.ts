import { GameView } from "jpgames-game-implementation-pixi";
import { Sprite, Texture } from "pixi.js";

export class JnPGameView extends GameView {

    constructor(name: string) {
        super(name);

        let sprite: Sprite = new Sprite(Texture.from("assets/rock.png"));
        this.addChild(sprite);

        sprite.scale.set(0.2);
        sprite.anchor.set(0.5);

        console.log(this);
    }

}