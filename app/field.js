import {Ui} from './ui.js'

export class Field extends Ui{
    constructor(x,y, number, discovered=false) {
        super()
        this.x = x
        this.y = y
        this.number = number
        this.ship = 0
        this.selector = `[data-x="${this.x}"][data-y="${this.y}"]`
        this.element = null
        
    }
    prepare_fields() {
        this.element.classList.remove('field--discovered')
        this.element.classList.remove('field--hit')
        this.element.classList.add('field--undiscovered')
    }
    remove_mark() {
        this.element.classList.remove('field--mouse--on')
    }

    reset() {
        switch(this.ship) {
            case 0: {
            } break
            case 1: {
                this.element.classList.remove('field--one_ship')
                this.ship = 0        
            } break
            case 2: {
                this.element.classList.remove('field--two_ship')
                this.ship = 0        
            } break
            case 3: {
                this.element.classList.remove('field--three_ship')
                this.ship = 0        
            } break
            case 4: {
                this.element.classList.remove('field--four_ship')
                this.ship = 0        
            } break

            default: {
                console.log(this.ship + "incorect value to reset in class Field method reset")
            } break
        }

        this.element.removeAttribute('data-index')
        
    }

    create_element() {
        const element = `<div class="field field--convex field--discovered" data-cell  data-x="${this.x}" data-y="${this.y}">${this.number}</div>`
        return element
    }
    
    discovered_field() {
        this.element.classList.remove('field--hit')
        this.element.classList.remove('field--undiscovered')
        this.element.classList.add('field--discovered')
    }

    hit_field() {
        this.element.classList.remove('field--undiscovered')
        this.element.classList.remove('field--discovered')
        this.element.classList.add('field--hit')
    }

    undiscovered_field() {        
        this.element.classList.remove('field--discovered')
        this.element.classList.remove('field--hit')
        this.element.classList.add('field--undiscovered')
    }

    move_on_field() {
        this.element.classList.add('field--mouse--on')
    }

    move_over_field() {
        this.element.classList.remove('field--mouse--on')
    }

    put(ship_size) {
        switch (ship_size) {
            case 1: { 
                this.element.classList.add('field--one_ship')
                this.element.setAttribute(this.UiSelectors.ship_index, 1)
                this.ship = 1
            } break
            case 2: { 
                this.element.classList.add('field--two_ship')
                this.element.setAttribute(this.UiSelectors.ship_index, 2)
                this.ship = 2
            } break
            case 3: { 
                this.element.classList.add('field--three_ship')
                this.element.setAttribute(this.UiSelectors.ship_index, 3)
                this.ship = 3
            } break
            case 4: { 
                this.element.classList.add('field--four_ship')
                this.element.setAttribute(this.UiSelectors.ship_index, 4)
                this.ship = 4
            } break
        }         
    }

    reset_in_game() {
        console.log("reset_in_game")
        this.element.classList.remove('field--discovered')
        this.element.classList.remove('hit--field')
        this.element.classList.add('field--undiscovered')
    }


}