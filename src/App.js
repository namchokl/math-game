import { Route, Redirect } from 'react-router-dom';

import MainHeader from './components/MainHeader';
import MathGamePage from './pages/MathGamePage';
import IceBrakeGamePage from './pages/IceBrakeGamePage';

import './App.css';

function App() {
  return (
    <>
      <MainHeader />
      <div className='App'>
        <Route path='/math-game'>
          <MathGamePage />
        </Route>
        <Route path='/icebrake-game'>
          <IceBrakeGamePage />
        </Route>
        <Route path='/'>
          <Redirect to='/math-game' />
        </Route>
      </div>
    </>
  );

};

export default App;