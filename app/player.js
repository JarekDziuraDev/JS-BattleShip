
export class Player {
    constructor(name) {
        this.name = name
        this.have_board = false
        this.board = null
        this.points = 0
    }

    check_board(row,col) {
        return this.board[row][col]
    }

    set_board(row,col, value) {
        this.board[row][col] = value
    }

    print_board() {
        for (let i=9; i<this.board.length; i++) {            
            for (let j=0; j<this.board[i].length; j++) {                                
                console.log(i + "-" + j + "-> " + this.board[i][j])
            }
            console.log()
        }
    }

    update_points(value) {
        if (value > 0) {
            value *= 10
        }
        this.points += value
    }

    check_any_ship() {
        let is_ship = false
        for (let i=0; i<this.board.length; i++) {            
            for (let j=0; j<this.board[i].length; j++) {                                
                if (this.board[i][j] > 0) {
                    is_ship = true
                }
            }            
        }
        return is_ship
    }
}