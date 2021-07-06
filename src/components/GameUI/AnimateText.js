import {useState, useEffect} from 'react';

import classes from './AnimateText.module.css';

const AnimateText = (props) => {
  const [activeIndex, setActiveIndex] = useState(0);
  // const [chars, setChars] = useState([]);

  const len = props.text.length;
  const chars = [...props.text];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex(prev => {
        return prev + 1 >= len ? 0 : prev + 1;
      });
    }, 300);

    return () => {
      clearInterval(timer);
    }
  }, [props.text, len]);

  const activeStyle = {
    // color: 'red',
    // fontWeight: 'bold',
    // fontSize: '120%',
    transform: `translate(0, -14px)`,
  };

  const inactiveStyle = {
    // color: 'blue',
    transform: `translateY(0px)`,
  };

  return (
    <div className={classes.animateText}>
      {chars.map((ch, i) => <span className={`${classes.char} ${ch === ' ' ? classes.space : ''}`} key={i} style={i === activeIndex ? activeStyle : inactiveStyle}>{ch}</span>)}
    </div>
  );
};

export default AnimateText;