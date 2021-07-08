import GameBoard from '../components/UI/GameBoard';
import GameTitle from '../components/GameTitle';
import MathGame from "../components/MathGame/MathGame";

const MathGamePage = () => {
  return (
    <GameBoard>
      <GameTitle />
      <MathGame questionNum='10' />
    </GameBoard>
  );
};

export default MathGamePage;