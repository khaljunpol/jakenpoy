import { ComponentView } from "jpgames-game-implementation-pixi";
import { RESULT } from "../../Utils/JakEnPoyConstants";
import { RESULT_STATE } from "./ResultsModel";
import { ResultsObject } from "./ResultsObject";

export class ResultsView extends ComponentView {

    protected _resultsObject: ResultsObject;

    constructor(name: string) {
        super(name);

        this._resultsObject = new ResultsObject();
        this.addChild(this._resultsObject);

        this.onResize();
    }

    public showResult(result: RESULT): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            if (this._isShown)
                return;

            super.show();

            this._resultsObject.reset();
            this._resultsObject.setResult(result);
            this._resultsObject.showSelected();

            this._resultsObject.showResult().then(() => {

                this.onCompleteState(RESULT_STATE.PRESENT_START);
                resolve();
            })

        });
    }

    public hideResult(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this._resultsObject.hideResult().then(() => {
                resolve();
            })

        });
    }

    public hide(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            if (!this._isShown)
                return;

            super.hide();

            resolve();
        });
    }

    public onCompleteState(state: RESULT_STATE): void {
        this._subject.next(state);
    }
}