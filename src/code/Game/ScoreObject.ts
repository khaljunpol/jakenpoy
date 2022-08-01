import { Container, Text, TextStyle } from "pixi.js";

export class ScoreObject extends Container {
    private _winText: Text;
    private _loseText: Text;

    private _drawText: Text;

    private _dashText: Text;

    constructor() {
        super();

        this.alpha = 0;

        let style = new TextStyle({
            fontSize: 80, align: 'center',
            fill: ["#000000"],
            stroke: "#ffffff",
            strokeThickness: 5,
        });

        let drawstyle = new TextStyle({
            fontSize: 40, align: 'center',
            fill: ["#000000"],
            stroke: "#ffffff",
            strokeThickness: 5,
        });

        this.position.y = 200;

        this._dashText = new Text("-", style);
        this._winText = new Text("0", style);
        this._loseText = new Text("0", style);
        this._drawText = new Text("DRAW: 0", drawstyle);

        this.addChild(this._winText, this._dashText, this._loseText, this._drawText);

        this._winText.pivot.set(0.5);
        this._winText.anchor.set(0.5);
        this._dashText.pivot.set(0.5);
        this._dashText.anchor.set(0.5);
        this._loseText.pivot.set(0.5);
        this._loseText.anchor.set(0.5);
        this._drawText.pivot.set(0.5);
        this._drawText.anchor.set(0.5);

        this._winText.position.x = -300;
        this._loseText.position.x = 300;
        this._drawText.position.y = 100;
    }

    public setResult(win: number, lose: number, draw: number) {
        this._winText.text = win.toString();
        this._loseText.text = lose.toString();
        this._drawText.text = "DRAW: " + draw.toString();
    }

}