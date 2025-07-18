const gridSize = 10;
const mineCount = 15;
let grid = [];
let minePositions = [];

const game = document.getElementById('game');
const statusText = document.getElementById('status');

function initGame() {
  game.innerHTML = '';
  grid = [];
  minePositions = [];

  // Set up grid
  for (let i = 0; i < gridSize * gridSize; i++) {
    const cell = document.createElement('div');
    cell.classList.add('cell');
    cell.dataset.index = i;
    cell.addEventListener('click', handleClick);
    cell.addEventListener('contextmenu', handleRightClick);
    game.appendChild(cell);
    grid.push(cell);
  }

  // Place mines
  while (minePositions.length < mineCount) {
    const index = Math.floor(Math.random() * grid.length);
    if (!minePositions.includes(index)) {
      minePositions.push(index);
    }
  }
}

function handleClick(e) {
  const index = parseInt(e.target.dataset.index);
  if (e.target.classList.contains('flagged')) return;

  if (minePositions.includes(index)) {
    revealMines();
    statusText.textContent = '💥 Game Over!';
    disableBoard();
    return;
  }

  revealCell(index);
  checkWin();
}

function handleRightClick(e) {
  e.preventDefault();
  const cell = e.target;
  if (cell.classList.contains('revealed')) return;
  cell.classList.toggle('flagged');
  checkWin();
}

function revealCell(index) {
  const cell = grid[index];
  if (!cell || cell.classList.contains('revealed')) return;

  cell.classList.add('revealed');
  const adjacent = getAdjacentIndexes(index);
  const mineCount = adjacent.filter(i => minePositions.includes(i)).length;
  if (mineCount > 0) {
    cell.textContent = mineCount;
  } else {
    // Reveal surrounding
    adjacent.forEach(revealCell);
  }
}

function revealMines() {
  minePositions.forEach(index => {
    const cell = grid[index];
    cell.classList.add('revealed');
    const img = document.createElement('img');
img.src = 'mybomb.jpg';
img.style.width = '100%';
img.style.height = '100%';
cell.appendChild(img);

  });
}

function disableBoard() {
  grid.forEach(cell => {
    cell.removeEventListener('click', handleClick);
    cell.removeEventListener('contextmenu', handleRightClick);
  });
}

function checkWin() {
  const revealed = grid.filter(cell => cell.classList.contains('revealed')).length;
  if (revealed === grid.length - mineCount) {
    statusText.textContent = '🎉 You Win!';
    disableBoard();
  }
}

function getAdjacentIndexes(index) {
  const x = index % gridSize;
  const y = Math.floor(index / gridSize);
  const neighbors = [];

  for (let dy = -1; dy <= 1; dy++) {
    for (let dx = -1; dx <= 1; dx++) {
      if (dx === 0 && dy === 0) continue;
      const nx = x + dx;
      const ny = y + dy;
      if (nx >= 0 && nx < gridSize && ny >= 0 && ny < gridSize) {
        neighbors.push(ny * gridSize + nx);
      }
    }
  }

  return neighbors;
}

initGame();

const music = document.getElementById('bgMusic');
const playPauseBtn = document.getElementById('playPauseBtn');

playPauseBtn.addEventListener('click', () => {
  if (music.paused) {
    music.play();
    playPauseBtn.textContent = '⏸️ Pause Music';
  } else {
    music.pause();
    playPauseBtn.textContent = '▶️ Play Music';
  }
});
