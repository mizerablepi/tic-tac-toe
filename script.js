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
  let winner = null;
  let players = [];

  function setPlayer(p1Username, p1Tag, p2Username, p2Tag) {
    if (players.length != 0) return

    players.push(Player(p1Tag, 'X', p1Username));
    players.push(Player(p2Tag, 'O', p2Username));
  }
  
  function changeCurrentPlayer() {
    currentPlayer = currentPlayer == 0 ? 1 : 0;
  }

  function playTurn(rowcol) {
    let indexRow = +rowcol[0];
    let indexCol = +rowcol[1];

    if (illegalMove(indexRow, indexCol) || winner != null || players.length == 0) return;

    GameBoard.setMark(indexRow, indexCol, players[currentPlayer].mark);
    if (checkWinner()) {
      winner = players[currentPlayer];
      return;
    }
    if (GameBoard.isFull()) {
      console.log("DRAW!!!");
      return;
    } 
    changeCurrentPlayer();
    if (players[currentPlayer].name == 'Computer') {
      setTimeout(() => {
        playComputersTurn();
        ScreenController.updateScreen();
      },500);
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

  function checkWinner() {
    let board = GameBoard.getBoard();
    function checkRows() {
      for (let row of board){
        if (row[0] != '' && row[0] === row[1] && row[1] === row[2]) {
          return true;
        }
      }
      return false;
    }
    function checkColumns() {
      for (let i = 0; i < 3; i++){
        if (board[0][i] != '' && board[0][i] == board[1][i] && board[1][i] == board[2][i]) {
          return true;
        }
      }
      return false;
    }
    function checkDiagnols() {
      if (board[0][0] != '' && board[0][0] == board[1][1] && board[1][1] == board[2][2]) {
        return true;
      }
      if (board[0][2] != '' && board[0][2] == board[1][1] && board[1][1] == board[2][0]) {
        return true;
      }
      return false;
    }
    return (checkRows() || checkColumns() || checkDiagnols());
  }

  const getCurrentPlayer = () => players[currentPlayer].name;

  const getWinner = () => winner;

  return {setPlayer,playTurn,getCurrentPlayer,getWinner}
})();

function Player(name,mark,username) {
  return {name,mark,username}
}

const ScreenController = (function () {  
  let choiceForm = document.getElementsByClassName('menu')[0];
  
  let choiceBtn = document.querySelector('.menu button')
  choiceBtn.addEventListener('click', choiceHandler);

  let boardDiv = document.getElementsByClassName('board')[0];
  boardDiv.addEventListener('click', markHandler);

  function choiceHandler(event) {
    let p1Username = document.getElementById('p1-name').value;
    let p1Tag = document.querySelector('.player-1-form input[name="p1type"]:checked').value;
    let p2Username = document.getElementById('p2-name').value;
    let p2Tag = document.querySelector('.player-2-form input[name="p2type"]:checked').value;

    GameController.setPlayer(p1Username, p1Tag, p2Username, p2Tag);

    choiceForm.style.display = 'none';
  }

  function markHandler(event){
    GameController.playTurn(event.target.dataset.loc);
    updateScreen(); //draws the tic-tac-toe board on screen
  }

  function updateScreen() {
    let currentBoard = GameBoard.getBoard();
    let cells = document.querySelectorAll('main button');
    let boardArray = [];
    for (let i = 0; i < 3; i++){
      for (let j = 0; j < 3; j++){
        boardArray.push(currentBoard[i][j]);
      }
    }
    for (let i = 0; i < boardArray.length; i++){
      cells[i].textContent = boardArray[i];
    } 

    if (GameController.getWinner() != null) {
      for (let cell of cells) {
        cell.disabled = true;
      }
      console.log('sc rec')
      // TODO
    }else if (GameController.getCurrentPlayer() === 'Computer') {
      for (let cell of cells) {
        cell.disabled = true;
      }
    } else {
      for (let cell of cells) {
        cell.disabled = false;
      }
    }
  }


  return {updateScreen}
})();;