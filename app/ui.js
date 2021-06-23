export class Ui {
    UiSelectors = {
        board: '[data-board]',
        cell: '[data-cell]',
        button: '[data-ship-menu-buttons]',
        ship_index: 'data-index', //używane w metodzie put klasy Field  
        one_ship: '[data-one]',
        two_ship: '[data-two]',
        three_ship: '[data-three]',
        four_ship: '[data-four]',
        end_placement_phase: '[data-end-phase]',
        menu_player: '[data-menu-player]',
        menu_actual_player: '[data-player]',
        menu_ship: '[data-menu-ship]',
        menu_player_score: '[data-player-score]',
        menu_player_next: '[data-player-next]',
        menu_win: '[data-menu-win]',
        menu_win_button: '[data-menu-win-btn]',
        menu_win_name: '[data-menu_win_name]',
        menu_win_score: '[data-menu_win_score]'
    }

    getElement(selector) {
        return document.querySelector(selector)
    } 

    getElements(selector) {
        return document.querySelectorAll(selector)
    }

}