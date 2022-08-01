import gsap from "gsap";
import { ComponentView } from "jpgames-game-implementation-pixi";
import { Sprite, Texture } from "pixi.js";
import { SELECTION } from "../../Utils/JakEnPoyConstants";

import { SelectionObject } from "./SelectionObject";

export class SelectionView extends ComponentView {

    private selectionOffset: number = 300;

    protected _selections: SelectionObject[];
    protected _logo: Sprite;
    protected _select: Sprite;

    constructor(name: string) {
        super(name);

        this._logo = new Sprite(Texture.from((`assets/logo.png`)));
        this._select = new Sprite(Texture.from((`assets/select.png`)));

        this._logo.scale.set(0.7);
        this._logo.pivot.set(0.5);
        this._logo.anchor.set(0.5);
        this._logo.alpha = 0;

        this._select.scale.set(0.4);
        this._select.pivot.set(0.5);
        this._select.anchor.set(0.5);
        this._select.alpha = 0;

        this.addChild(this._logo, this._select);


        this.createSelection();

        this.onResize();
    }

    public show(): Promise<void> {
        return new Promise<void>((resolve, reject) => {

            this.interactiveChildren = false;

            gsap.killTweensOf(this._logo);
            gsap.killTweensOf(this._select);
            this._selections.forEach(selection => {
                selection.reset();
            });

            super.show();

            gsap.fromTo(this._logo, { alpha: 0 }, { duration: 0.5, alpha: 1 });
            gsap.fromTo(this._select, { alpha: 0 }, { duration: 0.5, alpha: 1 });
            gsap.fromTo(this._selections, { alpha: 0 }, {
                duration: 0.5,
                alpha: 1, onComplete: () => {
                    this.interactiveChildren = true;
                    resolve();
                }
            }).delay(0.5);
        });
    }

    public hide(): Promise<void> {
        return new Promise<void>((resolve, reject) => {

            gsap.fromTo(this._logo, { alpha: 1 }, { duration: 0.5, alpha: 0 });
            gsap.fromTo(this._select, { alpha: 1 }, { duration: 0.5, alpha: 0 });
            gsap.fromTo(this._selections, { alpha: 1 }, {
                duration: 0.5,
                alpha: 0,
                onComplete: () => {
                    super.hide();
                    resolve();
                }
            }).delay(0.5);
        });
    }

    public onResize(): void {
        super.onResize();

        let offset = -this.selectionOffset;

        if (window.innerHeight > window.innerWidth) {

            if (this._selections) {
                this._selections.forEach(selection => {
                    selection.position.x = 0;
                    selection.position.y = offset;
                    offset += this.selectionOffset + 40;
                });
            }

            if (this._logo) {
                this._logo.y = -550;
            }
            if (this._select) {
                this._select.y = 650;
            }
        }
        else {
            if (this._selections) {
                this._selections.forEach(selection => {
                    selection.position.y = 0;
                    selection.position.x = offset;
                    offset += this.selectionOffset;
                });
            }

            if (this._logo) {
                this._logo.y = -250;
            }
            if (this._select) {
                this._select.y = 250;
            }
        }
    }

    public onClickSelectionObject(type: SELECTION): void {
        // Wait 1 second before sending state
        setTimeout(() => {
            this._subject.next(type);
        }, 1000)
    }

    private createSelection() {
        this._selections = [];
        let selection = Object.keys(SELECTION);

        selection.forEach(obj => {
            let newSelection = new SelectionObject(obj.toLowerCase(), SELECTION[obj]);
            this.addChild(newSelection);

            newSelection.subject.subscribe({
                next: (type) => this.onClickSelectionObject(type)
            });

            this._selections.push(newSelection);
        });
    }

}