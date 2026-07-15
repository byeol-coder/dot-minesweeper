export const DOTPAD_WIDTH = 60;
export const DOTPAD_HEIGHT = 40;

export function makeMatrix() {
  return Array.from({ length: DOTPAD_HEIGHT }, () => Array(DOTPAD_WIDTH).fill(0));
}

export function setPin(matrix, x, y, value = 1) {
  if (x >= 0 && x < DOTPAD_WIDTH && y >= 0 && y < DOTPAD_HEIGHT) matrix[y][x] = value;
}

// A 2×2 tactile dot is easier to distinguish than a single raised pin while
// still leaving enough space between the stage locations on the 60×40 grid.
function setBoldPin(matrix, x, y) {
  [[0, 0], [1, 0], [0, 1], [1, 1]].forEach(([dx, dy]) => setPin(matrix, x + dx, y + dy));
}

export function buildHiddenDotFrame({ screen, stage, targetIndex, cursorIndex, blinkOn, stageComplete, showCursor = true }) {
  const matrix = makeMatrix();
  if (screen !== "game" || !stage) return matrix;
  const marginX = 7, marginY = 6;
  const stepX = stage.cols === 1 ? 0 : (DOTPAD_WIDTH - marginX * 2) / (stage.cols - 1);
  const stepY = stage.rows === 1 ? 0 : (DOTPAD_HEIGHT - marginY * 2) / (stage.rows - 1);
  const total = stage.cols * stage.rows;

  for (let i = 0; i < total; i++) {
    const row = Math.floor(i / stage.cols), col = i % stage.cols;
    const cx = Math.round(marginX + col * stepX), cy = Math.round(marginY + row * stepY);
    if (i === targetIndex) {
      setBoldPin(matrix, cx, cy);
      setBoldPin(matrix, cx, cy - 3); setBoldPin(matrix, cx, cy + 3);
      setBoldPin(matrix, cx - 3, cy); setBoldPin(matrix, cx + 3, cy);
      if (stageComplete) {
        setBoldPin(matrix, cx, cy - 6); setBoldPin(matrix, cx, cy + 6);
        setBoldPin(matrix, cx - 6, cy); setBoldPin(matrix, cx + 6, cy);
      }
    } else setBoldPin(matrix, cx, cy);

    if (showCursor && blinkOn && i === cursorIndex) {
      const r = 5;
      [[-r,-r],[-r+1,-r],[-r+2,-r],[r,-r],[r-1,-r],[r-2,-r],
        [-r,r],[-r+1,r],[-r+2,r],[r,r],[r-1,r],[r-2,r],
        [-r,-r+1],[-r,-r+2],[r,-r+1],[r,-r+2],[-r,r-1],[-r,r-2],[r,r-1],[r,r-2]]
        .forEach(([dx,dy]) => setPin(matrix, cx + dx, cy + dy));
    }
  }
  return matrix;
}

export function matrixToHex(matrix) {
  let hex = "";
  for (let cellY = 0; cellY < 10; cellY++) {
    for (let cellX = 0; cellX < 30; cellX++) {
      let value = 0;
      for (let lx = 0; lx < 2; lx++) {
        for (let ly = 0; ly < 4; ly++) {
          const x = cellX * 2 + lx, y = cellY * 4 + ly;
          if (matrix[y][x]) value |= (1 << (lx * 4 + ly));
        }
      }
      hex += value.toString(16).padStart(2, "0").toUpperCase();
    }
  }
  return hex;
}
