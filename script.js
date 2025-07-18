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

// Reveal a cell (and flood reveal if no adjacen
