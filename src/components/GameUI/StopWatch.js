import { useState, useEffect } from "react";

import classes from './StopWatch.module.css';

const StopWatch = (props) => {
  const [elaspeTime, setElaspeTime] = useState(0);  
  const [remainTime, setRemainTime] = useState(0);
  const [remainTimePct, setRemainTimePct] = useState(100);
  // const [timeout, setTimeout] = useState(false);

  const {startTime, timeout, onTimeout, showNumber} = props;

  useEffect(() => {
    const updateTime = () => {
      const elaspeTime_ms = (Date.now() - startTime);
      if( timeout > 0 ) {
        const remainTime_ms = Math.max(0, timeout - elaspeTime_ms);
        if( remainTime_ms === 0 ) {
          if( onTimeout ) {
            clearInterval(timer);
            onTimeout();
          }
        }
        setRemainTimePct(remainTime_ms * 100 / timeout);
        setRemainTime(remainTime_ms);
      }
      setElaspeTime( elaspeTime_ms );
      // setElaspeTime( ((Date.now() - startTime)/1000).toFixed(1) );
    }

    let timer = setInterval(() => {
      updateTime();
    }, 100);
    return () => {
      clearInterval(timer);
    }
  }, [startTime, timeout, onTimeout])

  const displayTime = timeout > 0 ? remainTime : elaspeTime;

  return (
    <div className={classes.stopwatch}>
      { showNumber && <p>{`${(displayTime/1000).toFixed(1)} sec`}</p> }
      <div className={classes.gaugeBar}>
        <div className={classes.gaugeBar__fill} style={{width: `${remainTimePct}%`}}>
        </div>
      </div>
    </div>
  );
};

export default StopWatch;