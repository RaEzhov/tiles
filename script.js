const cellSize = getComputedStyle(document.documentElement).getPropertyValue(
  "--cell-size"
);

const offset = getComputedStyle(document.documentElement).getPropertyValue(
  "--offset"
);

let tiles = [];

let freeCell = {
  x: 3,
  y: 3,
};

function createCellNull() {
  const cell = document.createElement("div");
  cell.classList.add("field__cell");
  cell.classList.add("field__cell--null");
  cell.style.height = `calc(${cellSize})`;
  cell.style.width = `calc(${cellSize})`;
  return cell;
}

function setCellOffset(cell) {
  cell.style.top = `calc(${offset} / 2 + (${offset} + ${cellSize}) * ${cell.x})`;
  cell.style.left = `calc(${offset} / 2 + (${offset} + ${cellSize}) * ${cell.y})`;
}

function appendCell(cell) {
  document.getElementById("field").append(cell);
}

function createField() {
  for (let x = 0; x < 4; ++x) {
    for (let y = 0; y < 4; ++y) {
      let cell = createCellNull();
      cell.x = x;
      cell.y = y;
      setCellOffset(cell);
      appendCell(cell);
    }
  }
}

function createCellTile() {
  const cell = document.createElement("div");
  cell.classList.add("field__cell");
  cell.classList.add("field__cell--tile");
  cell.style.height = `calc(${cellSize})`;
  cell.style.width = `calc(${cellSize})`;
  cell.style.position = "absolute";
  return cell;
}

function createTiles() {
  for (let x = 0; x < 4; ++x) {
    for (let y = 0; y < 4; ++y) {
      if (x == 3 && y == 3) {
        break;
      }
      let cell = createCellTile();
      cell.x = x;
      cell.y = y;
      cell.innerHTML = x * 4 + y + 1;
      setCellOffset(cell);
      tiles.push(cell);
      appendCell(cell);
    }
  }
}

function animateTiles() {
  tiles.forEach((tile) => {
    tile.addEventListener("click", tileClick);
  });
}

function between(a, b, t) {
  return (a <= t && t <= b) || (b <= t && t <= a);
}

function tileClick(event) {
  let bar = event.target;
  const [x, y] = [event.target.x, event.target.y];

  if (freeCell.x === bar.x) {
    tiles.forEach((tile) => {
      if (tile.x === bar.x && between(bar.y, freeCell.y, tile.y)) {
        if (freeCell.y > bar.y) {
          tile.y++;
        } else {
          tile.y--;
        }
        setCellOffset(tile);
      }
    });
    freeCell.y = y;
  } else if (freeCell.y === bar.y) {
    tiles.forEach((tile) => {
      if (tile.y === bar.y && between(bar.x, freeCell.x, tile.x)) {
        if (freeCell.x > bar.x) {
          tile.x++;
        } else {
          tile.x--;
        }
        setCellOffset(tile);
      }
    });
    freeCell.x = x;
  }
  checkVictory();
}

function shuffleTiles() {
  for (let i = 0; i < 1000; i++) {
    const ind = Math.floor(Math.random() * tiles.length);
    tiles[ind].click();
  }
}

function checkVictory() {
  let isSorted = true;
  tiles.forEach((tile) => {
    if (tile.innerHTML != tile.x * 4 + tile.y + 1) {
      isSorted = false;
    }
  });
  if (isSorted) {
    document.getElementById("modal").classList.add("modal--visible");
  } else {
    document.getElementById("modal").classList.remove("modal--visible");
  }
}

createField();
createTiles();
animateTiles();
shuffleTiles();
