import gsap from "gsap";
import { ComponentView } from "jpgames-game-implementation-pixi";
import { SELECTION } from "../../JakEnPoyConstants";
import { SelectionObject } from "./SelectionObject";

export class SelectionView extends ComponentView {

    private selectionOffset: number = 300;

    protected _selections: SelectionObject[];

    constructor(name: string) {
        super(name);

        this.createSelection();

        this.onResize();

        console.log(this);
    }

    public show(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            if (this._isShown)
                return;

            this.interactiveChildren = false;

            super.show();

            gsap.fromTo(this._selections, 0.5, { alpha: 0 }, {
                alpha: 1, onComplete: () => {
                    this.interactiveChildren = true;
                    resolve();
                }
            }).delay(0.5);
        });
    }

    public hide(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            if (!this._isShown)
                return;

            gsap.fromTo(this._selections, 0.5, { alpha: 1 }, {
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
                    offset += this.selectionOffset;
                });
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
        }
    }

    public onClickSelectionObject(type: SELECTION): void {
        console.log("CLICK", type);
        this._subject.next(type);
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