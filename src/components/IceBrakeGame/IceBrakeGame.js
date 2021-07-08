import { useState, useEffect, useCallback } from 'react';

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

const IceBrakeGame = (props) => {
  const [hexagonGen, setHexagonGen] = useState();
  const [playCells, setPlayCells] = useState([]);
  const [fixedCells, setFixedCells] = useState([]);
  const [dropCells, setDropCells] = useState([]);
  const [playPolygons, setPlayPolygons] = useState();
  const [fixedPolygons, setFixedPolygons] = useState();
  const [dropPolygons, setDropPolygons] = useState();
  const [boardMap, setBoardMap] = useState();

  useEffect(() => {
    setHexagonGen(hexagonGenerator(8, 20, 20, 0.9));
    const game = createGameBoard();

    setPlayCells(game.playCells);
    setFixedCells(game.fixedCells);

    setBoardMap(game.boardMap);
  }, []);

  const cellClickHandler = useCallback((cell) => {
    function brakeCell(theCell) {
      // 1) set cell.fixed = false.
      // 2) move cell from 'playCells' to 'dropCells'.
      // 3) find more drop cells from circum-cells.
      theCell.type = 'drop';
      theCell.fixed = false;
      setPlayCells((prev) => prev.filter((cell) => cell !== theCell));
      setDropCells((prev) => [...prev, theCell]);

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

    // console.log(`click on cell: ${this.col}, ${this.row}`, this);
    if (cell.type !== 'play') return;

    brakeCell(cell);
  }, [boardMap]);

  const genPolygonListFn = useCallback(
    (cells, useReference = false, id) => {
      if (useReference) {
        let x0, y0, x, y;

        const svgObjects = cells.map((cell, index) => {
          let obj;

          if (index === 0) {
            const position_0 = hexagonGen.getPosition_rowCol(
              cell.row,
              cell.col
            );
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
            obj.onMouseEnter = cellClickHandler.bind(null, cell);
          }

          return obj;
        });

        return SvgItemListBuilder(svgObjects);
      }
    },
    [cellClickHandler]
  );

  // const genPolygonList = (cells, useReference = false, id) => {
  //   if (useReference) {
  //     let x0, y0, x, y;

  //     const svgObjects = cells.map((cell, index) => {
  //       let obj;

  //       if (index === 0) {
  //         const position_0 = hexagonGen.getPosition_rowCol(cell.row, cell.col);
  //         x0 = position_0.x;
  //         y0 = position_0.y;

  //         obj = {
  //           tag: 'polygon',
  //           id: id,
  //           key: cell.key,
  //           points: hexagonGen.getSvgPoints_rowCol(cell.row, cell.col),
  //         };
  //       } else {
  //         const position = hexagonGen.getPosition_rowCol(cell.row, cell.col);
  //         x = position.x - x0;
  //         y = position.y - y0;

  //         obj = {
  //           tag: 'use',
  //           key: cell.key,
  //           xlinkHref: '#'+id,
  //           transform: `translate(${x} ${y})`,
  //         };
  //       }

  //       if (cell.type === 'play') {
  //         obj.onClick = cellClickHandler.bind(cell);
  //       }

  //       return obj;
  //     });

  //     return SvgItemListBuilder(svgObjects);
  //   }

  //   const svgObjects = cells.map((cell) =>
  //     cell.type === 'play'
  //       ? {
  //           tag: 'polygon',
  //           key: cell.key,
  //           points: hexagonGen.getSvgPoints_rowCol(cell.row, cell.col),
  //           // style: cell.style,
  //           onClick: cellClickHandler.bind(cell),
  //           // onMouseEnter: cellClickHandler.bind(cell),
  //         }
  //       : {
  //           tag: 'polygon',
  //           key: cell.key,
  //           points: hexagonGen.getSvgPoints_rowCol(cell.row, cell.col),
  //         }
  //   );

  //   return SvgItemListBuilder(svgObjects);
  // }

  useEffect(() => {
    if (!playCells) return;

    const polygonsList = genPolygonListFn(playCells, true, 'cell1');
    setPlayPolygons(polygonsList);
  }, [playCells, genPolygonListFn]);

  useEffect(() => {
    if (!fixedCells) return;

    const polygonsList = genPolygonListFn(fixedCells, true, 'cell2');
    setFixedPolygons(polygonsList);
  }, [fixedCells, genPolygonListFn]);

  useEffect(() => {
    if (!dropCells) return;

    const polygonsList = genPolygonListFn(dropCells, true, 'cell3');
    setDropPolygons(polygonsList);
  }, [dropCells, genPolygonListFn]);

  // function brakeCell(theCell) {
  //   // 1) set cell.fixed = false.
  //   // 2) move cell from 'playCells' to 'dropCells'.
  //   // 3) find more drop cells from circum-cells.
  //   theCell.type = 'drop';
  //   theCell.fixed = false;
  //   setPlayCells((prev) => prev.filter((cell) => cell !== theCell));
  //   setDropCells((prev) => [...prev, theCell]);

  //   const brakeCircumCell = () => {
  //     const unstableCells = getCircumUnstableCell(
  //       boardMap,
  //       theCell.row,
  //       theCell.col
  //     );

  //     unstableCells.forEach((cell) => {
  //       brakeCell(cell);
  //     });
  //   };

  //   setTimeout(brakeCircumCell, 120);
  // }

  // function cellClickHandler(event) {
  //   function brakeCell(theCell) {
  //     // 1) set cell.fixed = false.
  //     // 2) move cell from 'playCells' to 'dropCells'.
  //     // 3) find more drop cells from circum-cells.
  //     theCell.type = 'drop';
  //     theCell.fixed = false;
  //     setPlayCells((prev) => prev.filter((cell) => cell !== theCell));
  //     setDropCells((prev) => [...prev, theCell]);

  //     const brakeCircumCell = () => {
  //       const unstableCells = getCircumUnstableCell(
  //         boardMap,
  //         theCell.row,
  //         theCell.col
  //       );

  //       unstableCells.forEach((cell) => {
  //         brakeCell(cell);
  //       });
  //     };

  //     setTimeout(brakeCircumCell, 120);
  //   }

  //   // console.log(`click on cell: ${this.col}, ${this.row}`, this);
  //   if (this.type !== 'play') return;

  //   brakeCell(this);
  // }

  // const fixedClasses = classes.fixed;

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
