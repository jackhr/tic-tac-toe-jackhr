const playerLookup = {
  '0': 'url("")',
  '1': 'url("https://cdn.icon-icons.com/icons2/1238/PNG/512/letterx_83737.png")',
  '-1': 'url("http://cdn.onlinewebfonts.com/svg/img_354470.png")',
};
const turnLookup = {
  '1': "https://cdn.icon-icons.com/icons2/1238/PNG/512/letterx_83737.png",
  '-1': "http://cdn.onlinewebfonts.com/svg/img_354470.png"
}

let board, turn, winner, clickCount;

const boardEl = document.getElementById('board');
const msgDivEl = document.getElementById('winner-msg');
const winnerImgEl = document.getElementById('winner-img');
const msgEl = document.getElementById('wins');
const squareEls = [...document.querySelectorAll('#board > div')];
const replayBtn = document.querySelector('button');

boardEl.addEventListener('click', handlePlayerClick);
if (!winner) boardEl.addEventListener('mouseover', addShade);
boardEl.addEventListener('mouseout', removeShade);
winnerImgEl.addEventListener('click', changePlayer);
replayBtn.addEventListener('click', init);

init();
function changePlayer(evt) {
  let img = evt.target;
  let total = 0;
  board.forEach(function(squareValue) {
    total += squareValue;    
  });
  if (total === 0) {
    turn *= -1;
    img.setAttribute('src', `${turnLookup[turn]}`);
  }
}
function addShade(evt) {
  let idx = squareEls.indexOf(evt.target);
  let div = document.getElementById(`sq${idx}`);
  if (winner) return;
  div.style.backgroundColor = 'rgba(3, 48, 26, 0.064)';
}
function removeShade(evt) {
  let idx = squareEls.indexOf(evt.target);
  let div = document.getElementById(`sq${idx}`);
  div.style.backgroundColor = '';
}
function handlePlayerClick(evt) {
  clickCount++;
  const boardIdx = squareEls.indexOf(evt.target);
  if (boardIdx === -1 || winner) return;
  board[boardIdx] = turn;
  turn *= -1;
  winner = getWinner();
  Tie();
  render(); 
}
function getWinner() {
  let winner = checkRows() || checkCols() || checkDiags();
  if (winner) {
    return winner
  } else {
    return undefined;
  }
}
function checkRows() {
  let threeInARowTop = Math.abs(board[0] + board[1] + board[2]);
  let threeInARowMid = Math.abs(board[3] + board[4] + board[5]);
  let threeInARowBot = Math.abs(board[6] + board[7] + board[8]);
  if (threeInARowTop === 3|| threeInARowMid ===3 || threeInARowBot === 3) {
    return turn *= -1;
  } else {
    return null;
  }
}
function checkCols() {
  let threeInAColLeft = Math.abs(board[0] + board[3] + board[6]);
  let threeInAColMid = Math.abs(board[1] + board[4] + board[7]);
  let threeInAColRight = Math.abs(board[2] + board[5] + board[8]);
  if (threeInAColLeft === 3|| threeInAColMid === 3|| threeInAColRight === 3) {
    return turn *= -1;
  } else {
    return null;
  }
}
function checkDiags() {
  let threeInDiag1 = Math.abs(board[0] + board[4] + board[8]);
  let threeInDiag2 = Math.abs(board[6] + board[4] + board[2]);  
  if (threeInDiag1 === 3|| threeInDiag2 === 3) {
    return turn *= -1;
  } else {
    return null;
  }
}
function Tie() {
  let total = 0;
  board.forEach(function(square) {
    total += square;
  });
  if ((total === 1 || total === -1) && clickCount === 9 && !winner) {
    winner = 'T';
  }
}
function init() {
  board = [
    0, 0, 0,
    0, 0, 0,
    0, 0, 0
  ];
  clickCount = 0;
  turn = 1;
  winner = null;
  render();
}
function render() {
  board.forEach(function(squareValue, boardIdx) {
    const square = document.getElementById(`sq${boardIdx}`)
    square.style.backgroundImage = playerLookup[squareValue];
    square.style.backgroundSize = 'cover';
    squareEls[boardIdx].style.pointerEvents = squareValue === 0 ? 'auto' : 'none';
    msgDivEl.style.width = '36vmin';
    winnerImgEl.style.visibility = 'visible';
    msgDivEl.style.justifyContent = 'space-between';
  });
  if (winner === 'T') {
    msgEl.textContent = "it's a tie!"
    winnerImgEl.style.visibility = 'hidden';
    msgDivEl.style.width = '55vmin';
    msgDivEl.style.justifyContent = 'flex-start';
  } else if (winner) {
    msgEl.innerHTML = 'wins!';
    winnerImgEl.setAttribute('src', `${turnLookup[winner]}`);
    msgDivEl.style.width = '35vmin'
  } else {
    msgEl.innerHTML = "to go";
    winnerImgEl.setAttribute('src', `${turnLookup[turn]}`);
  }
  replayBtn.style.visibility = winner ? 'visible' : 'hidden';
  if (board.indexOf(1) !== -1 || board.indexOf(-1) !== -1) {
    document.getElementById('change-player-div').style.visibility = 'hidden';
  } else {
    document.getElementById('change-player-div').style.visibility = 'visible';
  }
}