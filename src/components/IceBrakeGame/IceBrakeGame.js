import { useState, useEffect, useCallback, useReducer } from 'react';

import {
  hexagonGenerator,
  getCellKey,
  createCell,
  getAdjacentCells,
  isCellStable,
  getCircumUnstableCell,
} from '../../utils/hexagon-tools/hexagon-board';

import SvgBox, { SvgGroup, SvgItemListBuilder, buildSvgTag } from '../UI/SvgBox';

import classes from './IceBrakeGame.module.css';

// const hexagonGen = hexagonGenerator(8, 20, 20, 0.9);

const cellStyles = {
  normal: {
    fill: 'rgb(120, 180, 242)',
    stroke: 'rgb(150, 170, 202)',
    strokeWidth: 0.75,
  },
  fixed: {
    fill: 'gray',
    stroke: 'black',
    strokeWidth: 0.5,
  },
  drop: {
    fill: 'white',
    stroke: 'gray',
    strokeWidth: 0.5,
    visibility: 'hidden',
  },
  hidden: {
    visibility: 'hidden',
  }
};

// const animate = {
//   id: 'a1',
//   attributeName: 'fill',
//   from: 'red',
//   to: 'blue',
//   dur: '3s',
//   fill: 'freeze',
// };

function createGameBoard() {
  const rowNum = 48,
    colNum = 28;

  const playCells = [],
    fixedCells = [],
    playCellMap = new Map(),
    fixedCellMap = new Map(),
    boardMap = new Map();

  let colMod;
  for (let col = 0; col < colNum; col++) {
    colMod = col % 2;
    for (let row = 0; row < rowNum; row++) {
      if (row % 2 !== colMod) continue;
      const cell = createCell(row, col, 'play', true);
      playCells.push(cell);
      playCellMap.set(cell.key, cell);

      boardMap.set(cell.key, cell);
    }
  }

  playCells.forEach((cell) => {
    const { col, row } = cell;
    const adjacentCells = getAdjacentCells(row, col);

    adjacentCells.forEach((adjCell) => {
      const key = getCellKey(adjCell.row, adjCell.col); // `${adjCell.col}-${adjCell.row}`;
      if (!playCellMap.has(key) && !fixedCellMap.has(key)) {
        const cell = createCell(adjCell.row, adjCell.col, 'fixed', true);
        fixedCells.push(cell); // push fixed cells into 'boardCells'
        fixedCellMap.set(cell.key, cell);

        boardMap.set(cell.key, cell);
      }
    });
  });

  return {
    playCells,
    fixedCells,
    boardMap,
  };
}

const genCellPolygon = (
  cell,
  clickHandler,
  boardMap,
  hexagonGen,
  id,
  useTag = true,
) => {
  let obj, x, y;

  if (useTag) {
    const position = hexagonGen.getPosition_rowCol(cell.row, cell.col);
    x = position.x;
    y = position.y;

    obj = {
      tag: 'use',
      key: cell.key,
      xlinkHref: '#' + id,
      // transform: `translate(${x.toFixed(2)} ${y.toFixed(2)})`,
      x: x.toFixed(2),
      y: y.toFixed(2),
    };
  } else {
    const position_0 = hexagonGen.getPosition_rowCol(cell.row, cell.col);
    x = position_0.x;
    y = position_0.y;

    obj = {
      tag: 'polygon',
      id: id,
      key: cell.key,
      points: hexagonGen.getSvgPoints_rowCol(cell.row, cell.col),
    };
  }

  if (clickHandler && cell.type === 'play') {
    // obj.onClick = cellClickHandler.bind(null, cell);
    obj.onMouseEnter = clickHandler.bind(null, cell, boardMap, hexagonGen);
  }

  return obj;
};

const genPolygonListFn = (cells, clickHandler, boardMap, hexagonGen, source) => {

  const svgObjects = cells.map((cell, index) => {
    return genCellPolygon(
      cell,
      clickHandler,
      boardMap,
      hexagonGen,
      source.id,
      true,
    );
  });

  return SvgItemListBuilder(svgObjects);
};

const initGameState = {
  playCells: [],
  fixedCells: [],
  dropCells: [],
  playCells_polygons: [],
  fixedCells_polygons: [],
  dropCells_polygons: [],
  hexagonGen: null,
  onClick: null,
  svgAssets: {},
};

const createSvgAssets = (hexagonGen) => {
  const iceCellId = 'ice01';
  // const cell_00_pos = hexagonGen.getPosition_rowCol(0, 0);
  
  const sourceCell = createCell(0, 0, 'asset', false);
  // const iceCell_pos = hexagonGen.getPosition_rowCol(sourceCell.row, sourceCell.col);
  const iceCellObj = genCellPolygon(sourceCell, null, null, hexagonGen, iceCellId, false);

  const iceCellSvg = buildSvgTag(iceCellObj);

  const svgAssets = {
    iceCells: {
      id: iceCellId,
      svg: iceCellSvg,
      // offset: {
      //   x: iceCell_pos.x - cell_00_pos.x,
      //   y: iceCell_pos.y - cell_00_pos.y,
      // },
    }
  };

  return svgAssets;
};

const gameStateReducer = (state, action) => {
  const { type, payload } = action;
  const { svgAssets } = state;

  if (type === 'init') {
    return {
      ...state,
      hexagonGen: payload.hexagonGen,
      onClick: payload.onClick,
      svgAssets: createSvgAssets(payload.hexagonGen),
    };
  }

  if (type === 'reset') {
    const { playCells, fixedCells, boardMap } = createGameBoard();

    const playCells_polygons = genPolygonListFn(
      playCells,
      state.onClick,
      boardMap,
      state.hexagonGen,
      svgAssets.iceCells,
    );

    const fixedCells_polygons = genPolygonListFn(
      fixedCells,
      state.onClick,
      boardMap,
      state.hexagonGen,
      svgAssets.iceCells,
    );

    const newState = {
      ...state,
      playCells: playCells,
      fixedCells: fixedCells,
      playCells_polygons,
      fixedCells_polygons,
      boardMap: boardMap,
    };

    return newState;
  }

  // if (type === 'set') {
  //   const { to, data, boardMap } = payload;
  //   const polygonKey = to + '_polygons';
  //   const newPolygons = genPolygonListFn(
  //     data,
  //     state.onClick,
  //     boardMap,
  //     state.hexagonGen,
  //     svgAssets.iceCells,
  //   );

  //   const newState = { ...state, [to]: data, [polygonKey]: newPolygons };

  //   return newState;
  // }

  if (type === 'move') {
    const { cell, from, to, boardMap } = payload;
    
    // let st, ts;
    // st = performance.now();

    // const newFrom = state[from].filter((item) => item !== cell);
    const cellIndex_from = state[from].indexOf(cell);
    const newFrom = state[from].slice();
    newFrom.splice(cellIndex_from, 1);

    // ts = performance.now();
    // console.log(`%c time = ${(ts-st)}`, 'color: red');

    const newTo = [...state[to], cell];

    const fromPolygonKey = from + '_polygons';
    const toPolygonKey = to + '_polygons';

    const theMoveItem = state[fromPolygonKey][cellIndex_from];
    const newFromPolygons = state[fromPolygonKey].filter(
      (item, index) => index !== cellIndex_from
    );

    const newToPolygons = [...state[toPolygonKey], theMoveItem];

    const newState = {
      ...state,
      [from]: newFrom,
      [to]: newTo,
      [fromPolygonKey]: newFromPolygons,
      [toPolygonKey]: newToPolygons,
    };

    return newState;
  }

  return state;
};

const IceBrakeGame = (props) => {
  // const [hexagonGen, setHexagonGen] = useState();
  // const [boardMap, setBoardMap] = useState();

  const cellClickHandler = useCallback((cell, boardMap, hexagonGen) => {
    function brakeCell(theCell) {
      // 1) set cell.fixed = false.
      // 2) move cell from 'playCells' to 'dropCells'.
      // 3) find more drop cells from circum-cells.
      theCell.type = 'drop';
      theCell.fixed = false;

      dispatch({
        type: 'move',
        payload: {
          cell: theCell,
          from: 'playCells',
          to: 'dropCells',
          boardMap: boardMap,
        },
      });

      const brakeCircumCell = () => {
        const unstableCells = getCircumUnstableCell(
          boardMap,
          theCell.row,
          theCell.col
        );

        unstableCells.forEach((cell) => {
          brakeCell(cell);
        });
      };

      setTimeout(brakeCircumCell, 120);
    }

    if (cell.type === 'play') {
      brakeCell(cell);
    }
  }, []);

  useEffect(() => {
    const hexagonGen = hexagonGenerator(8, 20, 20, 0.9);

    dispatch({
      type: 'init',
      payload: {
        hexagonGen: hexagonGen,
        onClick: cellClickHandler,
      },
    });

    dispatch({
      type: 'reset',
      payload: null,
    });
  }, [cellClickHandler]);

  const [gameState, dispatch] = useReducer(gameStateReducer, initGameState);

  const playPolygons = gameState.playCells_polygons;
  const fixedPolygons = gameState.fixedCells_polygons;
  const dropPolygons = gameState.dropCells_polygons;

  const iceCellAsset = gameState.svgAssets.iceCells && gameState.svgAssets.iceCells.svg;

  return (
    <div className={classes.board}>
      <SvgBox viewBox='0 0 400 400'>
        <SvgGroup style={cellStyles.hidden}>
          { iceCellAsset }
        </SvgGroup>
        
        <SvgGroup style={cellStyles.fixed}>{fixedPolygons}</SvgGroup>
        <SvgGroup style={cellStyles.normal}>{playPolygons}</SvgGroup>
        <SvgGroup style={cellStyles.drop}>{dropPolygons}</SvgGroup>
      </SvgBox>
    </div>
  );
};

export default IceBrakeGame;
