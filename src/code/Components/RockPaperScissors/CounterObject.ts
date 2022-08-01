import { Container } from "pixi.js";
import { JakEnPoyObject } from "./JakEnPoyObject";

export class CounterObject extends Container {

    private _jak: JakEnPoyObject;
    private _en: JakEnPoyObject;
    private _poy: JakEnPoyObject;

    private _index: number;

    constructor() {
        super();

        this._jak = new JakEnPoyObject("jak", 0.7);
        this._en = new JakEnPoyObject("en", 0.9);
        this._poy = new JakEnPoyObject("poy", 1.1);

        this.addChild(this._jak, this._en, this._poy);
    }

    public reset(): void {
        this._index = 0;
        this._jak.reset();
        this._en.reset();
        this._poy.reset();
    }

    public showCounterIndexIncrement(): void {
        this.showCounterIndex(this._index);
        this._index++;
    }

    public showCounterIndex(index: number): void {
        switch (index) {
            case 0:
                this._jak.show();
                break;
            case 1:
                this._en.show();
                break;
            case 2:
                this._poy.show();
                break;
        }
    }
}