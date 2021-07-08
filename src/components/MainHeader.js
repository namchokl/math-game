import { NavLink } from 'react-router-dom';

import classes from './MainHeader.module.css';

const MainHeader = () => {
  return (
    <header className={classes.mainHeader} >
      <nav>
        <ul>
          <li>
            <NavLink activeClassName={classes.active} to="/math-game">Math Game</NavLink>
          </li>
          <li>
            <NavLink activeClassName={classes.active} to="/icebrake-game">Ice Braker Game</NavLink>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default MainHeader;