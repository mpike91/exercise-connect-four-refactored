class Player {
  constructor(number, color){
    this.number = number;
    this.color = color;
  }
}

class Game {
  constructor(HEIGHT, WIDTH, p1, p2){
    this.HEIGHT = HEIGHT;
    this.WIDTH = WIDTH;
    this.p1 = p1;
    this.p2 = p2;
    this.currPlayer = p1; // active player: 1 or 2
    this.board = []; // array of rows, each row is array of cells  (board[y][x])
    this.gameOver = false;
    this.makeBoard();
    this.makeHtmlBoard();
    this.hoverColor();
  }

  /** Connect Four
   *
   * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
   * column until a player gets four-in-a-row (horiz, vert, or diag) or until
   * board fills (tie)
   */

  /** makeBoard: create in-JS board structure:
   *   board = array of rows, each row is array of cells  (board[y][x])
   */

  makeBoard() {
    for (let y = 0; y < this.HEIGHT; y++) {
      this.board.push(Array.from({ length: this.WIDTH }));
    }
  }

  /** makeHtmlBoard: make HTML table and row of column tops. */

  makeHtmlBoard() {
    // Create board element & append it to the game element.
    const board = document.createElement("table");
    board.setAttribute("id", "board");
    document.getElementById("game").append(board);

    // make column tops (clickable area for adding a piece to that column)
    const top = document.createElement('tr');
    top.setAttribute('id', 'column-top');
    // top.addEventListener('click', this.handleClick);
    top.addEventListener('click', this.handleClick.bind(this));

    for (let x = 0; x < this.WIDTH; x++) {
      const headCell = document.createElement('td');
      headCell.setAttribute('id', x);
      top.append(headCell);
    }

    board.append(top);

    // make main part of board
    for (let y = 0; y < this.HEIGHT; y++) {
      const row = document.createElement('tr');

      for (let x = 0; x < this.WIDTH; x++) {
        const cell = document.createElement('td');
        cell.setAttribute('id', `${y}-${x}`);
        row.append(cell);
      }

      board.append(row);
    }
  }

  /** findSpotForCol: given column x, return top empty y (null if filled) */

  findSpotForCol(x) {
    for (let y = this.HEIGHT - 1; y >= 0; y--) {
      if (!this.board[y][x]) {
        return y;
      }
    }
    return null;
  }

  /** placeInTable: update DOM to place piece into HTML table of board */

  placeInTable(y, x) {
    const piece = document.createElement('div');
    piece.classList.add('piece');
    piece.style.backgroundColor = this.currPlayer.color;
    piece.style.top = -50 * (y + 2);

    const spot = document.getElementById(`${y}-${x}`);
    spot.append(piece);
  }

  /** endGame: announce game end */

  endGame(msg) {
    this.gameOver = true;
    alert(msg);
  }

  /** handleClick: handle click of column top to play piece */

  handleClick(evt) {
    // Return if game is over
    if (this.gameOver) return;
    // get x from ID of clicked cell
    const x = +evt.target.id;
    // get next spot in column (if none, ignore click)
    const y = this.findSpotForCol(x);
    if (y === null) {
      return;
    }

    // place piece in board and add to HTML table
    this.board[y][x] = this.currPlayer.number;
    this.placeInTable(y, x);
    
    // check for win
    if (this.checkForWin()) {
      return this.endGame(`${this.currPlayer.color} player won!`);
    }
    
    // check for tie
    if (this.board.every(row => row.every(cell => cell))) {
      return this.endGame('Tie!');
    }
      
    // switch players
    this.currPlayer = this.currPlayer === this.p1 ? this.p2 : this.p1;
    this.hoverColor();
  }

  // Changes the "hover" color depending upon current player
  hoverColor() {
    let css = `#column-top td:hover {background-color: ${this.currPlayer.color};`;
    let style = document.createElement('style');
    if (style.styleSheet) {
      style.styleSheet.cssText = css;
    } else {
      style.append(document.createTextNode(css));
    }
    document.getElementsByTagName('head')[0].appendChild(style);
  }

  /** checkForWin: check board cell-by-cell for "does a win start here?" */

  checkForWin() {
    const _win = (cells) => {
      // Check four cells to see if they're all color of current player
      //  - cells: list of four (y, x) cells
      //  - returns true if all are legal coordinates & all match currPlayer

      return cells.every(
        ([y, x]) =>
          y >= 0 &&
          y < this.HEIGHT &&
          x >= 0 &&
          x < this.WIDTH &&
          this.board[y][x] === this.currPlayer.number
      );
    }

    for (let y = 0; y < this.HEIGHT; y++) {
      for (let x = 0; x < this.WIDTH; x++) {
        // get "check list" of 4 cells (starting here) for each of the different
        // ways to win
        const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
        const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
        const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
        const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

        // find winner (only checking each win-possibility as needed)
        if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
          return true;
        }
      }
    }
  }
};

const newGame = (event) => {
  // Check if a gameboard exists; if it does, remove it
  const currBoard = document.getElementById("board");
  if (currBoard) currBoard.remove();

  // Create player instances
  const p1 = new Player(1, document.getElementById("p1").value);
  const p2 = new Player(2, document.getElementById("p2").value);

  // Create game board if players colors' are not the same
  if (p1.color === p2.color) return alert("Players cannot be same color");
  new Game (6, 7, p1, p2);
}
document.getElementById("start-game").addEventListener("click", newGame);