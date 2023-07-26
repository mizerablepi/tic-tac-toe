const GameBoard = (function () {
  let board = [
    ['', '', ''],
    ['', '', ''],
    ['', '', ''],
  ];
  let turnCount = 0;

  const getBoard = () => board;

  function setMark(row, col, mark) {
    board[row][col] = mark;
    turnCount++;
  }

  function getMark(row, col) {
    return board[row][col];
  }

  function isFull() {
    if (turnCount === 9) return true;
    return false;
  }

  return {getBoard, getMark, setMark, isFull}
})();

const GameController = (function () {
  let currentPlayer = 0;

  let players = [];

  function setPlayer(choice) {
    if (players.length != 0) return

    if (choice === 'X') {
      players.push(Player('Player 1', 'X'));
      players.push(Player('Computer', 'O'));
    } else {
      players.push(Player('Computer', 'X'));
      players.push(Player('Player 1', 'O'));
      playComputersTurn();
    }
  }
  
  function changeCurrentPlayer() {
    currentPlayer = currentPlayer == 0 ? 1 : 0;
  }

  function playTurn(rowcol) {
    let indexRow = +rowcol[0];
    let indexCol = +rowcol[1];

    if (illegalMove(indexRow,indexCol)) return;
    GameBoard.setMark(indexRow, indexCol, players[currentPlayer].mark);
    // if (checkWinner()) return;
    if (GameBoard.isFull()) {
      console.log("DRAW!!!");
      return;
    } 
    changeCurrentPlayer();
    if (players[currentPlayer].name == 'Computer') {
      playComputersTurn();
    }
  }

  function illegalMove(row,col) {
    let mark = GameBoard.getMark(row, col);
    if (mark !== '') {
      return true;
    } else {
      return false;
    }
  }

  function playComputersTurn() {
    while (true) {
      var row = Math.floor((Math.random() * 10) % 3);
      var col = Math.floor((Math.random() * 10) % 3);
      if (!illegalMove(row, col)) break;
    }
    playTurn(row.toString() + col.toString());

  }

  // function checkWinner() {
  //   let board = GameBoard.getBoard();

  //   for (let row of board) {
  //     if ((row[0] == row[1]) && (row[1] == row[2])) {
  //       console.log('WON!!!!!!!')
  //       return true;
  //     }
  //   }
  // }

  function log() {
    ScreenController.updateScreen();
  }

  return {setPlayer,playTurn,log}
})();

function Player(name,mark) {
  return {name,mark}
}

const ScreenController = (function () {
  let choiceDiv = document.getElementsByTagName('footer')[0];
  choiceDiv.addEventListener('click', choiceHandler);

  let boardDiv = document.getElementsByClassName('board')[0];
  boardDiv.addEventListener('click', markHandler);

  function choiceHandler(event) {
    if (event.target.tagName == 'BUTTON') {
      GameController.setPlayer(event.target.textContent);
      choiceDiv.style.display = 'none';
      choiceDiv.removeEventListener('click', choiceHandler);
      updateScreen();
    }
  }

  function markHandler(event){
    GameController.playTurn(event.target.dataset.loc);
    updateScreen();
  }

  function updateScreen() {
    let currentBoard = GameBoard.getBoard();
    let cells = document.getElementsByTagName('button');
    let boardArray = [];
    for (let i = 0; i < 3; i++){
      for (let j = 0; j < 3; j++){
        boardArray.push(currentBoard[i][j]);
      }
    }
    for (let i = 0; i < boardArray.length; i++){
      cells[i].textContent = boardArray[i];
    }
  }

  updateScreen();

  return {updateScreen}
})();;