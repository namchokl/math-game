import GameBoard from '../components/UI/GameBoard';
import GameTitle from '../components/GameTitle';
import IceBrakeGame from '../components/IceBrakeGame/IceBrakeGame';

const IceBrakeGamePage = () => {

  return (
    <GameBoard>
      <GameTitle />
      <IceBrakeGame />
    </GameBoard>
  );
};

export default IceBrakeGamePage;