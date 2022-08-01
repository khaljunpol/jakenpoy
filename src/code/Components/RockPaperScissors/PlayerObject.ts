import gsap, { Back } from "gsap";
import { Container } from "pixi.js";
import { Subject } from "rxjs";
import { PLAYER_TYPE, SELECTION } from "../../Utils/JakEnPoyConstants";
import { HandObject } from "./HandObject";
import { RPS_GAME_STATE } from "./RockPaperScissorsModel";

export class PlayerObject extends Container {
    private _playerType: PLAYER_TYPE;
    private _handObject: HandObject;

    protected _subject: Subject<RPS_GAME_STATE>;

    public get subject(): Subject<RPS_GAME_STATE> {
        return this._subject;
    }

    constructor(playerType: PLAYER_TYPE, selectedID?: SELECTION) {
        super();

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
        gsap.killTweensOf(this._handObject);

        this._handObject.scale.x = 1;
        this._handObject.scale.y = 1;

        this._handObject.position.x = -1000;
        this._handObject.rotation = 1.5;

        if (this._playerType == PLAYER_TYPE.COMP) {
            this._handObject.position.x = 1000;
            this._handObject.scale.y = -1;
        }
    }

    // Show playing hands
    public enter(): Promise<void> {
        return new Promise<void>((resolve, reject) => {

            this._handObject.showInitialPose();

            let fromPosX = this._playerType == PLAYER_TYPE.COMP ? 1000 : -1000;
            let toPosX = this._playerType == PLAYER_TYPE.COMP ? 300 : -300;

            gsap.fromTo(this._handObject, { x: fromPosX }, {
                duration: 1,
                x: toPosX,
                ease: Back.easeOut.config(2),
                onComplete: () => {
                    this._subject.next(RPS_GAME_STATE.ENTER);
                    resolve();
                }
            }).delay(0.5);
        });
    }

    // Anticipate playing hands
    public prepare(counterCb?: Function): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            let upDown = gsap.timeline({
                onComplete: () => {
                    this._subject.next(RPS_GAME_STATE.PREPARE);
                    resolve();
                }
            });

            upDown.to(this._handObject, { duration: 0.25, y: -100, ease: Back.easeOut.config(3) })
                .to(this._handObject, { duration: 0.25, y: 100, ease: Back.easeOut.config(3) })
                .add(counterCb?.(0))
                .to(this._handObject, { duration: 0.25, y: -100, ease: Back.easeOut.config(3) })
                .to(this._handObject, { duration: 0.25, y: 100, ease: Back.easeOut.config(3) })
                .add(counterCb?.(1))
        });
    }

    // Show played hand
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
                gsap.to(this._handObject, { duration: 0.25, x: toPosX }).yoyo(true);
            }

            upDown.to(this._handObject, { duration: 0.25, y: -100, ease: Back.easeOut.config(2) })
                .add(addSequence)
                .to(this._handObject, { duration: 0.25, y: 0, ease: Back.easeOut.config(2) })
        });
    }

    // Emphasize winning hand
    public win(): void {

        gsap.to(this._handObject.scale, { duration: 0.5, x: this._handObject.scale.x * 1.2, y: this._handObject.scale.y * 1.2 });
        gsap.fromTo(this._handObject, { rotation: 1.4 }, {
            duration: 1,
            rotation: 1.6,
            repeat: -1
        }).yoyo(true);
    }

    // Hide playing hands
    public exit(): Promise<void> {
        return new Promise<void>((resolve, reject) => {

            let fromPosX = this._playerType == PLAYER_TYPE.COMP ? 200 : -200;
            let toPosX = this._playerType == PLAYER_TYPE.COMP ? 1000 : -1000;

            gsap.fromTo(this._handObject, { x: fromPosX }, {
                duration: 1,
                x: toPosX,
                ease: Back.easeOut.config(2),
                onComplete: () => {
                    resolve();
                }
            }).delay(0.5);
        });
    }
}