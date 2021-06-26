import MathGame from './MathGame/MathGame';

import classes from './GameBoard.module.css';

const GameBoard = () => {
  return (
    <div className={classes.gameboard}>
      <header className={classes.header} >
        <h1>Simple Math Exercise</h1>
        <p>Practice your math, exercise your brain.</p>
      </header>
      <section>
        <MathGame questionNum='10' />
      </section>

    </div>
  );
};

export default GameBoard;