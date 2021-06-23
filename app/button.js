import {Ui} from './ui.js'

export class ShipMenuButton extends Ui{
    constructor(ship_size) {
        super()
        this.ship_size = ship_size
        this.selector = `[data-index="${this.ship_size}"]`
        this.element = null
    }

    
}