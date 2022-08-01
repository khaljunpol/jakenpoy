import { SELECTION } from "./JakEnPoyConstants"


export class JakEnPoyUtils {

    static getResults(playerHand: SELECTION, compHand: SELECTION): { win, lose, draw } {
        switch (playerHand + compHand) {
            case 'ROCKSCISSORS':
            case 'PAPERROCK':
            case 'SCISSORSPAPER':
                return { win: true, lose: false, draw: false }
            case 'ROCKPAPER':
            case 'SCISSORSROCK':
            case 'PAPERSCISSORS':
                return { win: false, lose: true, draw: false }
            default:
                return { win: false, lose: false, draw: true }
        }
    }

    static randomizeCompHand(): SELECTION {
        let values = Object.keys(SELECTION)
        let idx = Math.floor(Math.random() * values.length);
        let randValue = values[idx];

        return SELECTION[randValue];
    }
}