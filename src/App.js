import { Route, Redirect } from 'react-router-dom';

import './App.css';
import MathGame from './components/MathGame/MathGame';

function App() {
  return (
    <div className='App'>
      <Route path='/math-game'>
        <MathGame questionNum='10' />
      </Route>
      <Route path='/'>
        <Redirect to='/math-game' />
      </Route>
    </div>
  );
}

export default App;
