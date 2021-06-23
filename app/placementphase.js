import {Field} from './field.js'
import { Player } from './player.js'
import {Ui} from './ui.js'

class PlacementPhase extends Ui{
    #board_setting = {
        board: {
            default_rows: 10,
            default_columns: 10,
            horizontal: 'horizontal',
            vertical: 'vertical'
        }
    }    
    #actual_player = {
        player_one: 1,
        player_two: 2,
        end_placement_phase: 3,
        finish_game: 4
    }

    #ship_setting = {
        small: {
            one_ship: 3,
            two_ship: 2,
            three_ship: 2,
            four_ship: 1
        },
        medium: {
            one_ship: 4,
            two_ship: 3,
            three_ship: 2,
            four_ship: 1
        },
        big: {
            one_ship: 5,
            two_ship: 4,
            three_ship: 3,
            four_ship: 2
        }
    }
    #dificulty_level_setting = {
        easy: 3000,
        medium: 2000,
        hard: 1000,
    }
    #game_phase = false
    #player_move = true

    #numberOfRows = null
    #numberOfColumns = null
    #number_of_one_ship = null
    #number_of_two_ship = null
    #number_of_three_ship = null
    #number_of_four_ship = null

    //zmienne przechowujące handler do <p> wyświetlające dostępną liczbę okrętów
    #one_ship_element = null
    #two_ship_element = null
    #three_ship_element = null
    #four_ship_element = null

    //przycisk kończący etap ustawiania statków/przełączający na następnego gracza
    #end_placement_phase_btn = null

    //ship menu buttons
    #ship_menu_buttons_element = null  
    
    //player menu
    //wyświetalnie w game.html aktualnego gracza
    #actual_player_element = null
    #actual_player_value = null //this.#actual_player.player_one

    #player_menu = null
    #player_menu_points = null
    #player_menu_next_btn = null


    #win_menu = null
    #win_menu_btn = null
    #win_menu_name = null
    #win_menu_score = null

    //rozmiar okrętu
    #ship_size = null    
    #ship_orientation = null

    #fields = [] //tablica pól
    #fields_element = null //zmienna do przechowywania uchwytu do wszystkich komórki/cell
        
    #board_of_fields = null //właściwa tablica, która dostaje wygenerowane pola i zniej są wyświetlane    
    
    player_1 = null
    player_2 = null

    
    initialize_game() {
        this.#initialize_players()     
        this.#handle_elements()
        this.#set_board()
        this.#print_ship_info()   
        this.#print_actual_player_info()
    }

    #initialize_players() {
        const names_one = localStorage.getItem('cached_names_player_one')
        const names_two = localStorage.getItem('cached_names_player_two')
        
        this.player_1 = new Player(names_one)
        this.player_2 = new Player(names_two)

        this.#actual_player_value = this.#actual_player.player_one
    }

    #print_ship_info() {
        this.#one_ship_element.innerText = this.#number_of_one_ship
        this.#two_ship_element.innerText = this.#number_of_two_ship
        this.#three_ship_element.innerText = this.#number_of_three_ship
        this.#four_ship_element.innerText = this.#number_of_four_ship        
    }

    #print_actual_player_info() {
        if (this.#actual_player_value === this.#actual_player.player_one) {
            this.#actual_player_element.innerText = "Aktualny gracz: " + this.player_1.name
        }
        if (this.#actual_player_value === this.#actual_player.player_two) {
            this.#actual_player_element.innerText = "Aktualny gracz: " + this.player_2.name
        }
    }

    #handle_elements() {
        this.#board_of_fields = this.getElement(this.UiSelectors.board)
        this.#one_ship_element = this.getElement(this.UiSelectors.one_ship) 
        this.#two_ship_element = this.getElement(this.UiSelectors.two_ship) 
        this.#three_ship_element = this.getElement(this.UiSelectors.three_ship) 
        this.#four_ship_element = this.getElement(this.UiSelectors.four_ship) 
        this.#end_placement_phase_btn = this.getElement(this.UiSelectors.end_placement_phase)        
        this.#player_menu_next_btn = this.getElement(this.UiSelectors.menu_player_next)
        this.#actual_player_element = this.getElement(this.UiSelectors.menu_actual_player)
        this.#ship_menu_buttons_element = this.getElements(this.UiSelectors.button)
        this.#player_menu = this.getElement(this.UiSelectors.menu_player)

        this.#win_menu = this.getElement(this.UiSelectors.menu_win)
        this.#win_menu_btn = this.getElement(this.UiSelectors.menu_win_button)
        this.#win_menu_name = this.getElement(this.UiSelectors.menu_win_name)
        this.#win_menu_score = this.getElement(this.UiSelectors.menu_win_score)

    }

    //ustawia parametry mapy i generuje board
    #set_board(rows = this.#board_setting.board.default_rows,
               columns = this.#board_setting.board.default_columns,
               one_ship = this.#ship_setting.small.one_ship,
               two_ship = this.#ship_setting.small.two_ship,
               three_ship = this.#ship_setting.small.three_ship,
               four_ship = this.#ship_setting.small.four_ship,
               ship_orientation = this.#board_setting.board.vertical
               )
    {
        this.#number_of_one_ship = one_ship
        this.#number_of_two_ship = two_ship
        this.#number_of_three_ship = three_ship
        this.#number_of_four_ship = four_ship

        this.#numberOfRows = rows
        this.#numberOfColumns = columns
        this.#ship_orientation = ship_orientation//'vertical'

        this.#gnerate_fields()
        this.#render_board()

        this.#fields_element = this.getElements(this.UiSelectors.cell)
        
        
        this.#add_field_event_listener()
        this.#add_ship_menu_buttons_event_listener()
        this.#add_end_placement_phase_button_event_listener()
        this.#add_menu_player_next_button_event_listener()
        this.#add_win_menu_button_event_listener()
        this.#add_keyboard_event_listener()

    }

    #reset_number_ships(one_ship = this.#ship_setting.small.one_ship,
        two_ship = this.#ship_setting.small.two_ship,
        three_ship = this.#ship_setting.small.three_ship,
        four_ship = this.#ship_setting.small.four_ship) { 

        this.#number_of_one_ship = one_ship
        this.#number_of_two_ship = two_ship
        this.#number_of_three_ship = three_ship
        this.#number_of_four_ship = four_ship

    }
    #reset_fields() {
        for (let row=0; row < this.#numberOfRows; row++) {            
            for (let col=0; col < this.#numberOfColumns; col++) {
                this.#fields[row][col].reset()                                
            }
        }
    }
    //#region keyboard function
    //m - zmiana orientacji układania statków
    
    #add_keyboard_event_listener() {
        document.addEventListener("keydown", this.#checkKeyPress)        
    }
    #checkKeyPress = (key) => {        
        this.#remove_all_mark_fields()
        if (key.code === "Space") {
            if (this.#ship_orientation == this.#board_setting.board.horizontal ) {
                this.#ship_orientation = this.#board_setting.board.vertical
            } else {
                this.#ship_orientation = this.#board_setting.board.horizontal
            }
        }     
        console.log(this.#ship_orientation)
    }
    //#endregion

    #add_menu_player_next_button_event_listener() {
        this.#player_menu_next_btn.addEventListener('click', this.#handle_menu_player_next)
    }
    #add_end_placement_phase_button_event_listener() {
        this.#end_placement_phase_btn.addEventListener('click', this.#handle_end_phase_condition)
    }    

    #add_win_menu_button_event_listener() {
        this.#win_menu_btn.addEventListener('click', this.#handle_win_menu_end)
    }
    #handle_win_menu_end = () => {

    }
    #handle_end_phase_condition = () => {
        //console.log("ok")
        if (this.#number_of_one_ship === 0 && 
            this.#number_of_two_ship === 0 &&
            this.#number_of_three_ship === 0 && 
            this.#number_of_four_ship === 0 ) {

                this.#export_player_board()                
        } else {
            console.log("you have some ships to use")
        }
        
        if (this.#actual_player_value === this.#actual_player.end_placement_phase) {
            this.#game_phase = true
            this.#ship_size = 1
            this.#reset_fields()
            this.#hide_placement_phase_menu()            
            this.#add_to_player_menu()
            this.#add_menu_player_next_button_event_listener()
            this.#prepare_player_first()
            this.#prepare_fields()
            this.#print_player_game_menu()
            
        }
    }

    #print_player_game_menu() {
        if(this.#actual_player_value === this.#actual_player.player_one) {
            this.#actual_player_element.innerText = "Aktualny gracz: " + this.player_1.name
            this.#player_menu_points.innerText = " Punkty: " + this.player_1.points
        } else if (this.#actual_player_value === this.#actual_player.player_two) {
            this.#actual_player_element.innerText = "Aktualny gracz: " + this.player_2.name
            this.#player_menu_points.innerText = "  Punkty: " + this.player_2.points
        }
    }
    #prepare_player_first() {
        this.#actual_player_value = this.#actual_player.player_one
    }

    #add_to_player_menu() {        
        this.#player_menu_points = this.getElement(this.UiSelectors.menu_player_score)
        this.#player_menu_next_btn.classList.remove('hide')
    }

    #hide_placement_phase_menu() {
        let placement_phase_menu_elements = this.getElements(this.UiSelectors.menu_ship)
        placement_phase_menu_elements.forEach( element => {
            element.classList.add('hide')
        })
    }

    #prepare_fields() {
        for (let row=0; row < this.#numberOfRows; row++) {            
            for (let col=0; col < this.#numberOfColumns; col++) {
                this.#fields[row][col].prepare_fields()
            }
        }     
    }

    #change_actual_player() {
        if (this.#actual_player_value === this.#actual_player.player_one) {
            this.#actual_player_value = this.#actual_player.player_two
        } else if (this.#actual_player_value === this.#actual_player.player_two) {
            if (this.#game_phase) {
                this.#actual_player_value = this.#actual_player.player_one
            } else {
                this.#actual_player_value = this.#actual_player.end_placement_phase
            }
            
        }
    }

    #export_player_board() {
        let board = []

        for (let i=0; i<this.#numberOfColumns; i++) {
            board[i] = []
            for (let j=0; j<this.#numberOfRows; j++) {
                board[i].push(this.#fields[i][j].ship)
            }

        }
        this.#init_board_player(board)
        this.#change_actual_player()
        this.#reset_fields()
        this.#reset_number_ships()
        this.#print_ship_info()                
        this.#print_actual_player_info()
    }

    #init_board_player(board) {
        if (this.player_1.have_board === false) {
            this.player_1.board = board
            this.player_1.have_board = true
        } else {
            this.player_2.board = board
            this.player_2.have_board = true
        }
    }

    #add_ship_menu_buttons_event_listener() {
        this.#ship_menu_buttons_element.forEach( (element) => {
            element.addEventListener('click', this.#handleShipMenuButtonClick)            
        })
    }

    #handleShipMenuButtonClick = (event) => {
        const target = event.target
        this.#ship_size = parseInt(target.getAttribute('data-index'), 10)
        this.#mark_the_button()
    }

    //metoda "zaznacza" jeden z przycisków który został wybrany do określenia statku jaki chcemy umieścić 
    #mark_the_button() {
        this.#ship_menu_buttons_element.forEach( (element) => {
            element.classList.remove('field--concave')
            element.classList.add('field--convex')
        })

        if (this.#ship_size >= 1 && this.#ship_size <= 4) {
            this.#ship_menu_buttons_element[this.#ship_size-1].classList.add('field--concave')
        }
    }
    //do każdego elementu div, którym jest pole, dodawane jest zdzarzenie poprzez metodę
    //addEventListener poprzez click na elemencie, uruchamiające #handleCellLPMClick,
    //czyli można powiedzieć że strona sprawdza który element zgłosił że został naciśnięty
    #add_field_event_listener() {
        this.#fields_element.forEach( (element) => {
            //dodanie rekacji na naciśnięcie
            element.addEventListener('click', this.#handleFieldClick)
            //dodanie reakcji na najechanie myszą
            element.addEventListener('mousemove', this.#handleFieldMouseMove)
            //dodanie reakcji na "odjechanie" myszą
            element.addEventListener('mouseout', this.#handleFieldMouseOver)
        })
    }

    //usuwa wszystkie zaznaczenia/klasę field--mouse--on z całej board
    #remove_all_mark_fields() {
        this.#fields.flat().forEach( (field) => {
            field.move_over_field()
        })
    }

    //usuwa klasę css field--mouse--on, czyli kolor niebieski kafelka/pola oznaczający że na tym polu jest kursor i mogą zostać położone statki
    #mark_remove_field(rowIndex, colIndex) {
        for (let i=0; i< this.#ship_size; i++) {
            if (this.#ship_orientation === this.#board_setting.board.vertical && rowIndex + this.#ship_size <= this.#numberOfRows) {
                this.#fields[rowIndex+i][colIndex].move_over_field()
            }            
            if (this.#ship_orientation === this.#board_setting.board.horizontal && colIndex + this.#ship_size <= this.#numberOfColumns) {                
                this.#fields[rowIndex][colIndex+i].move_over_field()
            }
        }
    }

    #handleFieldMouseOver = (event) => {
        const target = event.target        
        const rowIndex = parseInt(target.getAttribute('data-y'), 10)
        const colIndex = parseInt(target.getAttribute('data-x'), 10)

        this.#mark_remove_field(rowIndex, colIndex)
    }

    #mark_up_field(rowIndex, colIndex) {        
        //console.log(this.#ship_orientation)
        for (let i=0; i< this.#ship_size; i++) {
            if (this.#ship_orientation === this.#board_setting.board.vertical && rowIndex + this.#ship_size <= this.#numberOfRows) {                
                this.#fields[rowIndex+i][colIndex].move_on_field()
            }
            if (this.#ship_orientation === this.#board_setting.board.horizontal && colIndex + this.#ship_size <= this.#numberOfColumns) {                
                this.#fields[rowIndex][colIndex+i].move_on_field()
            }
            
        }
    }
    #handleFieldMouseMove = (event) => {
        const target = event.target        
        const rowIndex = parseInt(target.getAttribute('data-y'), 10)
        const colIndex = parseInt(target.getAttribute('data-x'), 10)
        
        if (this.#game_phase) {
            if (this.#actual_player_value === this.#actual_player.player_one) {
                if (this.player_2.check_board(rowIndex, colIndex) >= 0) {
                    this.#mark_up_field(rowIndex, colIndex)        
                    //console.log(this.player_1.check_board(rowIndex, colIndex))
                } 
            } else if (this.#actual_player_value === this.#actual_player.player_two) {
                if (this.player_1.check_board(rowIndex, colIndex) >= 0) {
                    this.#mark_up_field(rowIndex, colIndex)        
                }
            } 
        } else {
            this.#mark_up_field(rowIndex, colIndex)
        }
    }

    //
    //validation 
    //
    #put_the_ship_validation(rowIndex, colIndex, ship_size, orientation) {
        let no_margin = true
        let no_colision = true
        let no_empty = true

        switch (ship_size) {
            case 1: {
                if (this.#number_of_one_ship <= 0) {
                    no_empty = false
                }
            } break
            case 2: {
                if (this.#number_of_two_ship <= 0) {
                    no_empty = false
                }
            } break
            case 3: {
                if (this.#number_of_three_ship <= 0) {
                    no_empty = false
                }
            } break
            case 4: {
                if (this.#number_of_four_ship <= 0) {
                    no_empty = false
                }
            } break
        }

        if (orientation === this.#board_setting.board.vertical) {
            if (rowIndex + ship_size > this.#numberOfRows) {
                no_margin = false
            }
        }
        if (orientation === this.#board_setting.board.horizontal) {
            if (colIndex + ship_size > this.#numberOfColumns) {
                no_margin = false
            }
        }
        
        for (let i = 0; i < ship_size; i++) {
            if (orientation == this.#board_setting.board.vertical) {
                let field_attribut = null 
                field_attribut = parseInt(this.#fields[rowIndex+i][colIndex].element.getAttribute('data-index'), 10)
                if (field_attribut >= 1 && field_attribut <= 4) {
                    no_colision = false
                }
            }            
            if (orientation == this.#board_setting.board.horizontal) {
                let field_attribut = null 
                field_attribut = parseInt(this.#fields[rowIndex][colIndex+i].element.getAttribute('data-index'), 10)
                if (field_attribut >= 1 && field_attribut <= 4) {
                    no_colision = false
                }
            }
        }
        console.log("no_margin" + no_margin)
        console.log("no_colision" + no_colision)
        return no_colision && no_margin && no_empty
    }

    #decrease_ship_fleet(ship_size) {
        switch (ship_size) {
            case 1: { this.#number_of_one_ship-- } break
            case 2: { this.#number_of_two_ship-- } break
            case 3: { this.#number_of_three_ship-- } break
            case 4: { this.#number_of_four_ship-- } break
        }
    }

    //metoda wywoływana w momęcie kliknięcia LPM na polu/field/kafelku, 
    //kursor oznacza początek rozmieszczania statków na mapie, i kładzie zgodnie z aktualną orientacją
    #put_the_ship(rowIndex, colIndex) {

        if (this.#ship_orientation === this.#board_setting.board.vertical) {
            if (this.#put_the_ship_validation(rowIndex, colIndex, this.#ship_size, this.#ship_orientation)) {
                for (let i=0; i< this.#ship_size; i++) {
                    this.#fields[rowIndex+i][colIndex].put(this.#ship_size)                        
                }                
                this.#decrease_ship_fleet(this.#ship_size)
            }
        }
        if (this.#ship_orientation === this.#board_setting.board.horizontal) {
            if (this.#put_the_ship_validation(rowIndex, colIndex, this.#ship_size, this.#ship_orientation)) {
                for (let i=0; i< this.#ship_size; i++) {
                    this.#fields[rowIndex][colIndex+i].put(this.#ship_size)    
                }                
                this.#decrease_ship_fleet(this.#ship_size)
            }
        }                
    }


    #handle_menu_player_next = (event) => {
        if (!this.#player_move) {
            this.#player_move = true

            this.#fields.flat().forEach( (field) => {
                field.reset_in_game()
            })
            
            this.#change_actual_player()
            this.#draw_board()
            this.#print_player_game_menu()
        }
        
    }


    //metoda obsługująca kliknięcie w komórkę
    #handleFieldClick = (event) => {
        //pobieranie 
        const target = event.target        
        const rowIndex = parseInt(target.getAttribute('data-y'), 10)
        const colIndex = parseInt(target.getAttribute('data-x'), 10)
        
        if (this.#game_phase) {            
            if (this.#player_move) {
                this.#discover_fields(rowIndex, colIndex)
                this.#player_move = false
                this.#print_player_game_menu()
                this.#check_win_condition()

            }                        
        } else {
            this.#put_the_ship(rowIndex, colIndex)
            this.#print_ship_info()
        }            
    }
    #winning(player) {
        this.#win_menu.classList.remove('hide')
        this.#win_menu_name.innerText = "YOU WIN " + player.name
        this.#win_menu_score.innerText = "SCORE: " + player.points

    }
    #check_win_condition() {
        console.log("OK")
        if (this.#actual_player_value === this.#actual_player.player_one) {
            if (!this.player_2.check_any_ship()) {
                this.#winning(this.player_1)
            }        
        } else if (this.#actual_player_value === this.#actual_player.player_two) {
            if (!this.player_1.check_any_ship()) {
                this.#winning(this.player_2)
            }            
        }
    }
   
    #draw_board() {                
        if (this.#actual_player_value === this.#actual_player.player_one) {
            for (let row=0; row < this.#numberOfRows; row++) {            
                for (let col=0; col < this.#numberOfColumns; col++) {  
                    if (this.player_2.check_board(row,col) === 0) {                        
                        this.#fields[row][col].undiscovered_field()
                    }else if (this.player_2.check_board(row,col) === -1) {                        
                        this.#fields[row][col].discovered_field()
                    } else if (this.player_2.check_board(row,col) === -2) {                    
                        this.#fields[row][col].hit_field()
                    }
                }
            }                        
        }
        if (this.#actual_player_value === this.#actual_player.player_two) {
            for (let row=0; row < this.#numberOfRows; row++) {            
                for (let col=0; col < this.#numberOfColumns; col++) {
                    if (this.player_1.check_board(row,col) === 0) {                        
                        this.#fields[row][col].undiscovered_field()
                    }else if (this.player_1.check_board(row,col) === -1) {                        
                        this.#fields[row][col].discovered_field()
                    } else if (this.player_1.check_board(row,col) === -2) {                    
                        this.#fields[row][col].hit_field()
                    }
                }
            }
        }
    }
                                    

    #discover_fields(rowIndex, colIndex) {
        this.#fields[rowIndex][colIndex].move_over_field()
       
        if (this.#actual_player_value === this.#actual_player.player_one) {
            if (this.player_2.check_board(rowIndex,colIndex) === 0) {                
                this.player_2.set_board(rowIndex,colIndex, -1)                
                this.#fields[rowIndex][colIndex].discovered_field()
                this.player_1.update_points(-1)
            }
            if (this.player_2.check_board(rowIndex,colIndex) > 0) {
                this.player_1.update_points(this.player_2.check_board(rowIndex,colIndex))
                this.player_2.set_board(rowIndex,colIndex, -2)
                this.#fields[rowIndex][colIndex].hit_field()
            }
        }
        if (this.#actual_player_value === this.#actual_player.player_two) {
            if (this.player_1.check_board(rowIndex,colIndex) === 0) {                
                this.player_1.set_board(rowIndex,colIndex, -1)
                this.#fields[rowIndex][colIndex].discovered_field()
                this.player_2.update_points(-1)
            }
            if (this.player_1.check_board(rowIndex,colIndex) > 0) {
                this.player_2.update_points(this.player_1.check_board(rowIndex,colIndex))
                this.player_1.set_board(rowIndex,colIndex, -2)
                this.#fields[rowIndex][colIndex].hit_field()
            }
        }
        this.player_1.print_board()
        this.player_2.print_board()
        
    }


    
    //wstawia do <board class="game__board" data-board></board> komórki
    #render_board() {
        this.#fields.flat().forEach(field => {
            this.#board_of_fields.insertAdjacentHTML('beforeend', field.create_element())
            field.element = field.getElement(field.selector)
            //console.log(cell.element)
        })
    }

    // buduje dwówymiarową tablicę cells
    #gnerate_fields() {
        let number = 1
        for (let row=0; row < this.#numberOfRows; row++) {
            this.#fields[row] = []
            //this.#board_of_ship[row] = []
            for (let col=0; col < this.#numberOfColumns; col++) {
                this.#fields[row].push(new Field(col, row, number))
                //this.#board_of_ship[row].push(new Ship)
                number++
            }
        }
    }
}


window.onload = function() {
    
    const placementphase = new PlacementPhase()

    placementphase.initialize_game()
}

function sleep( sleepDuration ){
    var now = new Date().getTime();
    while(new Date().getTime() < now + sleepDuration){} 
}