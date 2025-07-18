// ===== Minesweeper Clone with music & restart button =====

const rows = 10;
const cols = 10;
const totalMines = 15;

let minePositions = new Set();
let revealedCount = 0;
let gameOver = false;

const gameContainer = document.getElementById('game');
const statusText = document.getElementById('status');
const bgMusic = document.getElementById('bgMusic');
const loseSound = document.getElementById('loseSound');

// Create a 2D array to store cell elements and their info
let cells = [];

// Initialize the game grid and variables
function initGame() {
  gameOver = false;
  revealedCount = 0;
  minePositions.clear ? minePositions.clear() : minePositions = new Set();

  // Clear UI
  gameContainer.innerHTML = '';
  statusText.textContent = '';

  cells = [];

  // Create grid cells
  for (let r = 0; r < rows; r++) {
    cells[r] = [];
    for (let c = 0; c < cols; c++) {
      const cell = document.createElement('div');
      cell.classList.add('cell');
      cell.dataset.row = r;
      cell.dataset.col = c;
      cell.style.userSelect = 'none';
      cell.style.position = 'relative';

      cell.addEventListener('click', onCellClick);
      gameContainer.appendChild(cell);

      cells[r][c] = {
        element: cell,
        isMine: false,
        adjacentMines: 0,
        revealed: false,
      };
    }
  }

  placeMines();
  calculateAdjacents();
}

// Randomly place mines
function placeMines() {
  while (minePositions.size < totalMines) {
    const pos = Math.floor(Math.random() * rows * cols);
    if (!minePositions.has(pos)) minePositions.add(pos);
  }
  // Mark mine cells
  minePositions.forEach(pos => {
    const r = Math.floor(pos / cols);
    const c = pos % cols;
    cells[r][c].isMine = true;
  });
}

// Calculate adjacent mines count for each cell
function calculateAdjacents() {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (cells[r][c].isMine) continue;

      let count = 0;
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          if (dr === 0 && dc === 0) continue;
          const nr = r + dr;
          const nc = c + dc;
          if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
            if (cells[nr][nc].isMine) count++;
          }
        }
      }
      cells[r][c].adjacentMines = count;
    }
  }
}

// Handle cell click event
function onCellClick(e) {
  if (gameOver) return;

  const cellElem = e.currentTarget;
  const r = Number(cellElem.dataset.row);
  const c = Number(cellElem.dataset.col);
  const cell = cells[r][c];

  if (cell.revealed) return;

  revealCell(r, c);

  if (cell.isMine) {
    gameLost();
  } else if (revealedCount === rows * cols - totalMines) {
    gameWon();
  }
}

// Reveal a cell (and flood reveal if no adjacent mines)
function revealCell(r, c) {
  const cell = cells[r][c];
  if (cell.revealed) return;

  cell.revealed = true;
  revealedCount++;

  const el = cell.element;
  el.classList.add('revealed');
  el.style.pointerEvents = 'none';

  if (cell.isMine) {
    el.innerHTML = `<img src="mybomb.jpg" alt="bomb" style="width:100%;height:100%;">`;
  } else if (cell.adjacentMines > 0) {
    el.textContent = cell.adjacentMines;
    el.style.color = getNumberColor(cell.adjacentMines);
    el.style.fontWeight = 'bold';
  } else {
    // empty cell: reveal neighbors recursively
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        if (dr === 0 && dc === 0) continue;
        const nr = r + dr;
        const nc = c + dc;
        if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
          revealCell(nr, nc);
        }
      }
    }
  }
}

// Returns color based on number of adjacent mines
function getNumberColor(num) {
  const colors = {
    1: 'blue',
    2: 'green',
    3: 'red',
    4: 'darkblue',
    5: 'brown',
    6: 'cyan',
    7: 'black',
    8: 'gray',
  };
  return colors[num] || 'black';
}

// Game lost: show all mines, stop bg music, play lose sound
function gameLost() {
  gameOver = true;
  statusText.textContent = '💥 You hit a mine! Game Over.';
  
  // Reveal all mines
  minePositions.forEach(pos => {
    const r = Math.floor(pos / cols);
    const c = pos % cols;
    const cell = cells[r][c];
    if (!cell.revealed) {
      cell.revealed = true;
      const el = cell.element;
      el.classList.add('revealed');
      el.style.pointerEvents = 'none';
      el.innerHTML = `<img src="mybomb.jpg" alt="bomb" style="width:100%;height:100%;">`;
    }
  });

  // Pause bg music and play lose sound
  if (bgMusic) bgMusic.pause();
  if (loseSound) {
    loseSound.currentTime = 0;
    loseSound.play();
  }
}

// Game won: stop the game and show message
function gameWon() {
  gameOver = true;
  statusText.textContent = '🎉 Congratulations! You cleared all mines!';
  if (bgMusic) bgMusic.pause();
}

// Background music play/pause toggle (optional)
const playPauseBtn = document.getElementById('playPauseBtn');
if (playPauseBtn) {
  playPauseBtn.addEventListener('click', () => {
    if (bgMusic.paused) {
      bgMusic.play();
      playPauseBtn.textContent = '⏸️ Pause Music';
    } else {
      bgMusic.pause();
      playPauseBtn.textContent = '▶️ Play Music';
    }
  });
}

// Restart button logic
const restartBtn = document.getElementById('restartBtn');
if (restartBtn) {
  restartBtn.addEventListener('click', () => {
    if (loseSound) {
      loseSound.pause();
      loseSound.currentTime = 0;
    }
    if (bgMusic) {
      bgMusic.currentTime = 0;
      bgMusic.play();
    }
    statusText.textContent = '';
    initGame();
  });
}

// Start the game on page load
window.onload = () => {
  initGame();
  if (bgMusic) bgMusic.play();
};

setInterval(() => {
  document.body.style.backgroundColor = '#' + Math.floor(Math.random()*16777215).toString(16);
}, 800);
