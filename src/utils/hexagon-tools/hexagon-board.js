export function getCellKey(row, col) {
  return `${col}-${row}`;
}

export function createCell(row, col, type, fixed = true) {
  return {
    key: getCellKey(row, col),
    col,
    row,
    fixed,
    type,
  };
}

export const getAdjacentCells = (row, col) => {
  const cells = [
    { col: col + 1, row: row - 1 },
    { col: col + 1, row: row + 1 },
    { col: col, row: row + 2 },
    { col: col - 1, row: row + 1 },
    { col: col - 1, row: row - 1 },
    { col: col, row: row - 2 },
  ];

  return cells;
};

export const isCellStable = (boardMap, row, col) => {
  let fixedCellNum = 0;
  const adjCells = getAdjacentCells(row, col);

  const fixedCircum = adjCells.map((pos) => {
    const key = getCellKey(pos.row, pos.col);
    const cell = boardMap.get(key);
    if (cell && cell.fixed) {
      fixedCellNum++;
      return true;
    } else {
      return false;
    }
  });

  if (fixedCellNum < 2) return false;

  if (
    fixedCellNum > 3 ||
    (fixedCircum[0] && fixedCircum[3]) ||
    (fixedCircum[1] && fixedCircum[4]) ||
    (fixedCircum[2] && fixedCircum[5]) ||
    (fixedCircum[0] && fixedCircum[2] && fixedCircum[4]) ||
    (fixedCircum[1] && fixedCircum[3] && fixedCircum[5])
  ) {
    return true;
  }

  return false;
};

export const getCircumUnstableCell = (boardMap, row, col) => {
  const adjCells = getAdjacentCells(row, col).map(pos => boardMap.get(getCellKey(pos.row, pos.col)));
  const circumFixedCells = adjCells.filter(cell => (cell && cell.type === 'play' && cell.fixed));
  const unstableCells = circumFixedCells.filter(cell => !isCellStable(boardMap, cell.row, cell.col));

  return unstableCells;
}

export const hexagonGenerator = (d, top = 0, left = 0, cellScale = 1) => {
  console.log(d);
  
  const l = 2 * d, // cell width
    h = l * Math.sin(Math.PI / 3), // cell height
    h_hf = 0.5 * h, // half of cell height
    d_hf = 0.5 * d,
    col_ofst = l - d_hf,
    x0 = d + left, // x of cell(0, 0)
    y0 = h_hf + top; // y of cell(0, 0)

  const d_scaled = d * cellScale,
    h_scaled = h * cellScale,
    h_hf_scaled = h_hf * cellScale,
    d_hf_scaled = d_hf * cellScale;

  const getPosition_rowCol = (row, col) => {
    const x = x0 + col * col_ofst,
      y = y0 + row * h_hf;

    return { x, y };
  };

  const getPoints_rowCol = (row, col, scale = 1.0) => {
    const { x: cx, y: cy } = getPosition_rowCol(row, col);
    const points = [
      { x: cx + d_hf_scaled, y: cy - h_hf_scaled },
      { x: cx + d_scaled, y: cy },
      { x: cx + d_hf_scaled, y: cy + h_hf_scaled },
      { x: cx - d_hf_scaled, y: cy + h_hf_scaled },
      { x: cx - d_scaled, y: cy },
      { x: cx - d_hf_scaled, y: cy - h_hf_scaled },
    ];

    return points;
  };

  const getSvgPoints_rowCol = (row, col) => {
    const points = getPoints_rowCol(row, col);
    const DIGITS = 1;

    let svgPoints = '';
    points.forEach((pt) => {
      svgPoints += `${pt.x.toFixed(DIGITS)},${pt.y.toFixed(DIGITS)} `;
    });

    return svgPoints;
  };

  // const getAdjacentCells = (row, col) => {
  //   const cells = [
  //     {col: col+1, row: row-1},
  //     {col: col+1, row: row+1},
  //     {col: col, row: row+2},
  //     {col: col-1, row: row+1},
  //     {col: col-1, row: row-1},
  //     {col: col, row: row-2},
  //   ];

  //   return cells;
  // };

  console.log( 'hexagonGenerator .... called !' );
  return {
    getPosition_rowCol,
    getPoints_rowCol,
    getSvgPoints_rowCol,
    // getAdjacentCells,
  };
};
