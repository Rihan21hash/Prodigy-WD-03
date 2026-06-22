'use strict';

// ─── Win combinations ─────────────────────────────────────────────────────────
const WIN_COMBOS = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // cols
  [0, 4, 8], [2, 4, 6],             // diagonals
];

// ─── State ────────────────────────────────────────────────────────────────────
let board = Array(9).fill(null);
let currentPlayer = 'X';
let gameActive = true;
let scores = { X: 0, O: 0, draw: 0 };

// ─── DOM References ───────────────────────────────────────────────────────────
const cells        = document.querySelectorAll('.cell');
const turnMark     = document.getElementById('turn-mark');
const turnText     = document.getElementById('turn-text');
const scoreValX    = document.getElementById('score-val-x');
const scoreValO    = document.getElementById('score-val-o');
const scoreValDraw = document.getElementById('score-val-draw');
const overlay      = document.getElementById('result-overlay');
const resultEmoji  = document.getElementById('result-emoji');
const resultTitle  = document.getElementById('result-title');
const resultSub    = document.getElementById('result-sub');

// ─── Board Click ──────────────────────────────────────────────────────────────
document.getElementById('board').addEventListener('click', function (e) {
  const cell = e.target.closest('.cell');
  if (!cell) return;

  const idx = parseInt(cell.dataset.index, 10);

  if (!gameActive || board[idx] !== null) return;

  // Place mark
  board[idx] = currentPlayer;
  cell.setAttribute('data-mark', currentPlayer);
  cell.textContent = currentPlayer;
  cell.disabled = true;

  // Check result
  const winCombo = getWinCombo();

  if (winCombo) {
    // Highlight winning cells
    winCombo.forEach(function (i) {
      cells[i].classList.add('winning');
    });

    scores[currentPlayer]++;
    updateScoreDisplay(currentPlayer);
    gameActive = false;

    setTimeout(function () {
      var emoji = currentPlayer === 'X' ? '\uD83D\uDFE3' : '\uD83D\uDFE2';
      showOverlay(emoji, 'Player ' + currentPlayer + ' Wins!', 'Congratulations!');
    }, 600);

  } else if (board.every(function (v) { return v !== null; })) {
    // Draw
    scores.draw++;
    updateScoreDisplay('draw');
    gameActive = false;
    setTimeout(function () {
      showOverlay('\uD83E\uDD1D', "It's a Draw!", 'Well played by both!');
    }, 300);

  } else {
    // Switch player
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    updateTurnIndicator();
  }
});

// ─── Restart Button ───────────────────────────────────────────────────────────
document.getElementById('btn-restart').addEventListener('click', resetRound);

// ─── Overlay Buttons ──────────────────────────────────────────────────────────
document.getElementById('btn-play-again').addEventListener('click', function () {
  hideOverlay();
  resetRound();
});

document.getElementById('btn-reset-scores').addEventListener('click', function () {
  scores = { X: 0, O: 0, draw: 0 };
  scoreValX.textContent    = '0';
  scoreValO.textContent    = '0';
  scoreValDraw.textContent = '0';
  hideOverlay();
  resetRound();
});

// ─── Helpers ─────────────────────────────────────────────────────────────────
function getWinCombo() {
  for (var i = 0; i < WIN_COMBOS.length; i++) {
    var combo = WIN_COMBOS[i];
    var a = combo[0], b = combo[1], c = combo[2];
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return combo;
    }
  }
  return null;
}

function resetRound() {
  board = Array(9).fill(null);
  currentPlayer = 'X';
  gameActive = true;

  cells.forEach(function (cell) {
    cell.removeAttribute('data-mark');
    cell.textContent = '';
    cell.classList.remove('winning');
    cell.disabled = false;
  });

  updateTurnIndicator();
}

function updateTurnIndicator() {
  turnMark.textContent = currentPlayer;
  turnMark.className   = 'turn-mark ' + (currentPlayer === 'X' ? 'x-turn' : 'o-turn');
  turnText.textContent = "'s turn";
}

function updateScoreDisplay(who) {
  var map = { X: scoreValX, O: scoreValO, draw: scoreValDraw };
  var target = map[who];
  if (!target) return;

  target.textContent = scores[who];

  // Bump animation
  target.classList.remove('bump');
  void target.offsetWidth; // reflow
  target.classList.add('bump');
  target.addEventListener('animationend', function () {
    target.classList.remove('bump');
  }, { once: true });
}

function showOverlay(emoji, title, sub) {
  resultEmoji.textContent = emoji;
  resultTitle.textContent = title;
  resultSub.textContent   = sub;
  overlay.classList.remove('hidden');
}

function hideOverlay() {
  overlay.classList.add('hidden');
}

// ─── Init ─────────────────────────────────────────────────────────────────────
updateTurnIndicator();
