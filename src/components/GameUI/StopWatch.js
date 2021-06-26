import { useState, useEffect } from "react";

import './StopWatch.css';

const StopWatch = (props) => {
  const [elaspeTime, setElaspeTime] = useState(0);  
  const [remainTime, setRemainTime] = useState(0);
  const [remainTimePct, setRemainTimePct] = useState(100);
  // const [timeout, setTimeout] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const elaspeTime_ms = (Date.now() - props.startTime);
      if( props.timeout > 0 ) {
        const remainTime_ms = Math.max(0, props.timeout - elaspeTime_ms);
        if( remainTime_ms === 0 ) {
          if( props.onTimeout ) {
            clearInterval(timer);
            props.onTimeout();
          }
        }
        setRemainTimePct(remainTime_ms * 100 / props.timeout);
        setRemainTime(remainTime_ms);
      }
      setElaspeTime( elaspeTime_ms );
      // setElaspeTime( ((Date.now() - props.startTime)/1000).toFixed(1) );
    }

    let timer = setInterval(() => {
      updateTime();
    }, 100);
    return () => {
      clearInterval(timer);
    }
  }, [props.startTime, props.timeout])

  const displayTime = props.timeout > 0 ? remainTime : elaspeTime;

  return (
    <div className='stopwatch'>
      { props.showNumber && <p>{`${(displayTime/1000).toFixed(1)} sec`}</p> }
      <div className='gaugeBar'>
        <div className='gaugeBar__fill' style={{width: `${remainTimePct}%`}}>
        </div>
      </div>
    </div>
  );
};

export default StopWatch;