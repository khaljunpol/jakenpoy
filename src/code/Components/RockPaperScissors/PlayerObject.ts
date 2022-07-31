import gsap, { Back } from "gsap";
import { Container } from "pixi.js";
import { Subject } from "rxjs";
import { PLAYER_TYPE, SELECTION } from "../../JakEnPoyConstants";
import { HandObject } from "./HandObject";
import { RPS_GAME_STATE } from "./RockPaperScissorsModel";

export class PlayerObject extends Container {
    private _playerType: PLAYER_TYPE;
    private _handObject: HandObject;
    private _onWin: boolean;

    protected _subject: Subject<RPS_GAME_STATE>;

    public get subject(): Subject<RPS_GAME_STATE> {
        return this._subject;
    }

    constructor(playerType: PLAYER_TYPE, selectedID?: SELECTION) {
        super();

        this._onWin = false;

        this._subject = new Subject<RPS_GAME_STATE>();
        this._playerType = playerType;

        let handId = selectedID;

        this._handObject = new HandObject(handId);

        this._handObject.position.x = -1000;
        this._handObject.rotation = 1.5;

        if (this._playerType == PLAYER_TYPE.COMP) {
            this._handObject.position.x = 1000;
            this._handObject.scale.y = -1;
            this._handObject.rotation = 1.6;
        }

        this.addChild(this._handObject);
    }

    public reset(): void {
        this._handObject.position.x = -1000;
        this._handObject.rotation = 1.5;

        if (this._playerType == PLAYER_TYPE.COMP) {
            this._handObject.position.x = 1000;
            this._handObject.scale.y = -1;
        }
    }

    public enter(): Promise<void> {
        return new Promise<void>((resolve, reject) => {

            gsap.killTweensOf(this._handObject);

            this._handObject.showInitialPose();

            let fromPosX = this._playerType == PLAYER_TYPE.COMP ? 1000 : -1000;
            let toPosX = this._playerType == PLAYER_TYPE.COMP ? 300 : -300;

            gsap.fromTo(this._handObject, 1, { x: fromPosX }, {
                x: toPosX,
                ease: Back.easeOut.config(2),
                onComplete: () => {
                    this._subject.next(RPS_GAME_STATE.ENTER);
                    resolve();
                }
            }).delay(0.5);
        });
    }

    public prepare(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            let upDown = gsap.timeline({
                repeat: 1, onComplete: () => {
                    this._subject.next(RPS_GAME_STATE.PREPARE);
                    resolve();
                }
            });

            upDown.to(this._handObject, 0.25, { y: -100, ease: Back.easeOut.config(3) })
                .to(this._handObject, 0.25, { y: 100, ease: Back.easeOut.config(3) })
        });
    }

    public show(selectedID: SELECTION): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            let upDown = gsap.timeline({
                onComplete: () => {
                    this._subject.next(RPS_GAME_STATE.SHOW);
                    resolve();
                }
            });

            this._handObject.setSelectedHand(selectedID);

            let toPosX = this._playerType == PLAYER_TYPE.COMP ? 200 : -200;

            let addSequence = () => {
                this._handObject.showSelected();
                gsap.to(this._handObject, 0.25, { x: toPosX }).yoyo(true);
            }

            upDown.to(this._handObject, 0.25, { y: -100, ease: Back.easeOut.config(2) })
                .add(addSequence)
                .to(this._handObject, 0.25, { y: 0, ease: Back.easeOut.config(2) })
        });
    }

    public win(): void {
        if (this._onWin)
            return;

        gsap.to(this._handObject, 0.25, { scaleX: this._handObject.scale.x * 2, scaleY: this._handObject.scale.y * 2 })
        gsap.fromTo(this._handObject, 1, { rotation: 1.4 }, {
            rotation: 1.6,
            repeat: -1
        }).yoyo(true);
        this._onWin = true;
    }

    public exit(): Promise<void> {
        return new Promise<void>((resolve, reject) => {

            let fromPosX = this._playerType == PLAYER_TYPE.COMP ? 200 : -200;
            let toPosX = this._playerType == PLAYER_TYPE.COMP ? 1000 : -1000;

            gsap.fromTo(this._handObject, 1, { x: fromPosX }, {
                x: toPosX,
                ease: Back.easeOut.config(2),
                onComplete: () => {
                    resolve();
                }
            }).delay(0.5);
        });
    }
}