import classes from './GameBoard.module.css';

const GameBoard = (props) => {
  return (
    <div className={classes.gameboard}>
      {props.children}
    </div>
  );
};

export default GameBoard;