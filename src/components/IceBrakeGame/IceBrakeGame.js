import { useState, useEffect, useCallback, useReducer } from 'react';

import {
  hexagonGenerator,
  getCellKey,
  createCell,
  getAdjacentCells,
  isCellStable,
  getCircumUnstableCell,
} from '../../utils/hexagon-tools/hexagon-board';

import SvgBox, { SvgGroup, SvgItemListBuilder } from '../UI/SvgBox';

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

const genPolygonListFn = (
  cells,
  clickHandler,
  boardMap,
  hexagonGen,
  useReference = false,
  id
) => {
  if (useReference) {
    let x0, y0, x, y;

    const svgObjects = cells.map((cell, index) => {
      let obj;

      if (index === 0) {
        const position_0 = hexagonGen.getPosition_rowCol(cell.row, cell.col);
        x0 = position_0.x;
        y0 = position_0.y;

        obj = {
          tag: 'polygon',
          id: id,
          key: cell.key,
          points: hexagonGen.getSvgPoints_rowCol(cell.row, cell.col),
        };
      } else {
        const position = hexagonGen.getPosition_rowCol(cell.row, cell.col);
        x = position.x - x0;
        y = position.y - y0;

        obj = {
          tag: 'use',
          key: cell.key,
          xlinkHref: '#' + id,
          transform: `translate(${x.toFixed(2)} ${y.toFixed(2)})`,
        };
      }

      if (cell.type === 'play') {
        // obj.onClick = cellClickHandler.bind(null, cell);
        obj.onMouseEnter = clickHandler.bind(null, cell, boardMap, hexagonGen);
      }

      return obj;
    });

    return SvgItemListBuilder(svgObjects);
  }
};

const initGameState = {
  playCells: [],
  fixedCells: [],
  dropCells: [],
  playCells_polygons: [],
  fixedCells_polygons: [],
  dropCells_polygons: [],
};

const gameStateReducer = (state, action) => {
  const { type, payload } = action;

  if (type === 'set') {
    const { to, data, clickHandler, boardMap, hexagonGen } = payload;
    const polygonKey = to + '_polygons';
    const newPolygons = genPolygonListFn(
      data,
      clickHandler,
      boardMap,
      hexagonGen,
      true,
      'cell_' + to
    );

    const newState = { ...state, [to]: data, [polygonKey]: newPolygons };

    return newState;
  }

  if (type === 'move') {
    const { cell, from, to, clickHandler, boardMap, hexagonGen } = payload;
    const cellIndex_from = state[from].indexOf(cell);
    const newFrom = state[from].filter((item) => item !== cell);
    const newTo = [...state[to], cell];

    const fromPolygonKey = from + '_polygons';
    const toPolygonKey = to + '_polygons';

    const newFromPolygons =
      cellIndex_from === 0
        ? genPolygonListFn(
            newFrom,
            clickHandler,
            boardMap,
            hexagonGen,
            true,
            'cell_' + from
          )
        : state[fromPolygonKey].filter(
            (item, index) => index !== cellIndex_from
          );

    // const newFromPolygons = genPolygonListFn(newFrom, clickHandler, boardMap, hexagonGen, true, 'cell_' + from);
    const newToPolygons = genPolygonListFn(
      newTo,
      clickHandler,
      boardMap,
      hexagonGen,
      true,
      'cell_' + to
    );

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
  const [hexagonGen, setHexagonGen] = useState();
  const [boardMap, setBoardMap] = useState();

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
          clickHandler: cellClickHandler,
          boardMap: boardMap,
          hexagonGen,
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

    if (cell.type !== 'play') return;

    brakeCell(cell);
  }, []);

  useEffect(() => {
    const hexagonGen = hexagonGenerator(8, 20, 20, 0.9);
    setHexagonGen(hexagonGen);
    const game = createGameBoard();

    dispatch({
      type: 'set',
      payload: {
        to: 'playCells',
        data: game.playCells,
        clickHandler: cellClickHandler,
        boardMap: game.boardMap,
        hexagonGen,
      },
    });

    dispatch({
      type: 'set',
      payload: {
        to: 'fixedCells',
        data: game.fixedCells,
        clickHandler: cellClickHandler,
        boardMap: game.boardMap,
        hexagonGen,
      },
    });

    setBoardMap(game.boardMap);
  }, [cellClickHandler]);

  const [gameState, dispatch] = useReducer(gameStateReducer, initGameState);

  const playPolygons = gameState.playCells_polygons;
  const fixedPolygons = gameState.fixedCells_polygons;
  const dropPolygons = gameState.dropCells_polygons;

  return (
    <div className={classes.board}>
      <SvgBox viewBox='0 0 400 400'>
        <SvgGroup style={cellStyles.fixed}>{fixedPolygons}</SvgGroup>
        <SvgGroup style={cellStyles.normal}>{playPolygons}</SvgGroup>
        <SvgGroup style={cellStyles.drop}>{dropPolygons}</SvgGroup>
      </SvgBox>
    </div>
  );
};

export default IceBrakeGame;
