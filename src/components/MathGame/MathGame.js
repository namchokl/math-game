import { useState, useEffect } from 'react';

import AnswerPane from "../GameUI/AnswerPane";
import QuestionPane from "../GameUI/QuestionPane";
import StopWatch from '../GameUI/StopWatch';
import AnimateText from '../GameUI/AnimateText';

import { mathGenerators, mathGeneratorList } from './math-question-logic';
import { randomInt } from '../../utils/mathUtil';

import classes from './MathGame.module.css';

const generateGameData = (number) => {
  const choiceNum = 4,
  maxValue = 10;

  const questionList = [];
  
  let correctIndex;

  function createChoices(number, correctAns, correctIndex) {
    const choices = [];
    const maxRandom = 10;
    let choice;

    for(let i=0; i<number; i++) {
      // ans = correctIndex === i ? correctAns : correctAns + Math.round(Math.random() * maxRandom - maxRandom/2);
      if( correctIndex === i ) {
        choice = correctAns;
      } else {
        do {
          choice = correctAns + Math.round(Math.random() * maxRandom - maxRandom/2);
        }
        while( choice === correctAns || choices.includes(choice));
      }
      choices.push(choice);
    }

    // console.group('createChoices');
    // console.log(correctIndex);
    // console.log(correctAns);
    // console.log(choices);
    // console.groupEnd();

    return choices;
  }

  const questionTypeNum = mathGeneratorList.length;

  for(let i=0; i<number; i++) {
    const {ans, question} = mathGeneratorList[randomInt(questionTypeNum)](maxValue);

    correctIndex = randomInt(choiceNum);

    questionList.push(
      {
        id: i,
        question: question,
        answerIndex: correctIndex,
        choices: createChoices(choiceNum, ans, correctIndex),
      }
    );
  }

  return questionList;
};

const questionTimeout_ms = 3000;

const MathGame = (props) => {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [correctAns, setCorrectAns] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameEnd, setGameEnd] = useState(false);
  const [startTime, setStartTime] = useState(0);
  const [questionList, setQuestionList] = useState( [] );
  
  const totalQuestions = questionList.length;
  const gameData = questionList[questionIndex];

  useEffect(() => {
    setQuestionList(generateGameData( props.questionNum ));
  }, [props.questionNum] );

  const proceedNextQuestion = () => {
    setQuestionIndex(prevVal => {
      const nextIndex = prevVal+1;
      if( nextIndex < totalQuestions ) {
        setStartTime(Date.now());
        return nextIndex;
      }
      setGameEnd(true);
    });
  }

  const answerClickHandler = (answerId) => {
    console.log( 'answer click !!');
    if( gameData.answerIndex === answerId ) {
      const remainTime_ms = questionTimeout_ms - (Date.now() - startTime);
      console.log(`%c - time-score : ${remainTime_ms}`, 'color:red');

      setCorrectAns(prevVal => prevVal + 1);
      setScore(prevVal => prevVal + remainTime_ms);
    }

    proceedNextQuestion();
  }

  const gameResetHandler = () => {
    setScore(0);
    setCorrectAns(0);
    setQuestionIndex(0);
    setGameEnd(false);
    setGameStarted(false);
    setQuestionList( generateGameData( props.questionNum ) );
  };

  const gameStartHandler = () => {
    setGameStarted(true);
    setStartTime(Date.now());
  }

  const timeoutHandler = () => {
    console.log('%c - timeout', 'color:red');
    proceedNextQuestion();
  }

  return (
    <section className={classes.mathgame}>
      { gameStarted && !gameEnd &&
        <div>
          <div className={classes.instructionPane}>
            <p>Instruction:</p>
            <p>click on the correct answer as fast as possible.</p>
          </div>
          <StopWatch startTime={startTime} timeout={questionTimeout_ms} onTimeout={timeoutHandler} showNumber={false} />
          <QuestionPane number={questionIndex+1} total={totalQuestions} question={gameData.question}/>
          <AnswerPane choices={gameData.choices} onAnswer={answerClickHandler} />
        </div> 
      }
      { !gameStarted &&
          <div>
            <AnimateText text='Ready ?' />
            <button className={classes.startButton} onClick={gameStartHandler}>Start
            </button>
          </div>
      }
      { gameStarted && 
        <div className={classes['game-results']}>
          <h4 className={classes.title}>- Your Results -</h4>
          <div className={classes.report}>
            <h3>Score = {`${Math.round(score * 100 / (questionTimeout_ms * totalQuestions))} / 100`}</h3>
            <h3>Correct answers = {`${correctAns} / ${totalQuestions}`}</h3>
            {/* <h3>Your time-score = {`${Math.round(score)}`}</h3> */}
          </div>
        </div>
      }
      { gameStarted && !gameEnd && <button className={classes.resetButton} onClick={gameResetHandler}>Reset</button> }
      { gameEnd &&
        <button className={classes.playAgainButton} onClick={gameResetHandler}>
          Play Again..
        </button>
      }
    </section>
  );
};

export default MathGame;