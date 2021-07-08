import SvgBox from './UI/SvgBox';

import { randomInt } from '../utils/mathUtil';

import classes from './GameTitle.module.css';

const path1 = {
  tag : 'path',
  key: 'path1',
  d : 'M 1.4437144,1.7204289 C 1.3589434,1.8657016 1.2060667,1.6778317 1.2022617,1.579534 1.1919502,1.3131531 1.5036851,1.1879082 1.7255044,1.2375235 2.1222871,1.3262736 2.286555,1.784521 2.1680725,2.1431139 1.9941947,2.6693634 1.372584,2.877464 0.88013443,2.6862398 0.22377666,2.4313681 -0.02909702,1.6412791 0.23645077,1.015954 0.57061555,0.22904621 1.531338,-0.06896318 2.2890843,0.27171261 3.2068166,0.68431664 3.5501504,1.8167797 3.1338834,2.7066939 2.7648547,3.4956201 1.9009792,3.9479152 1.0428095,3.8585849',
  stroke : "grey",
  strokeWidth : "0.5",
  fill : "red",
  style : {
    // transform: 'rotate(15deg) translate(3px, -3px)',
    transform: 'scale(0.9)',
  }
};


// const logoPaths = ['M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z'];
const logoPaths = [
  path1,
];

const bigCircle = {
  tag : 'circle',
  cx : 100,
  cy : 100,
  r : 99,
  stroke : "red",
  strokeWidth : 1,
  fill : "yellow",
};

const randSvg = [
  // bigCircle
];

for(let i=0; i< 100; i++) {
  const cx = randomInt(200),
    cy = randomInt(200),
    r = randomInt(12),
    R = randomInt(256),
    G = randomInt(256),
    B = randomInt(256),
    A = Math.random()*0.6;

  randSvg.push({
    tag : 'circle',
    cx,
    cy,
    r,
    // stroke : `rgb(${R} ${G} ${B})`,
    strokeWidth : 1,
    fill : `rgba(${R}, ${G}, ${B}, ${A})`,
  });
}

const GameTitle = (props) => {
  return (
    <header className={classes.header} >
      <div className={classes.logo}>
        <SvgBox viewBox='-0.2 -0.2 4 4' items={logoPaths} />
        <h1>Simple Math Exercise</h1>
      </div>
        <p>Practice your math, exercise your brain.</p>
      <div >          
      </div>
    </header>
  );
};

export default GameTitle;