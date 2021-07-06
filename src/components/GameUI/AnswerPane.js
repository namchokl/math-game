import AnswerButton from "./AnswerButton";

import classes from './AnswerPane.module.css';

const AnswerPane = (props) => {
  return (
    <div className={classes.answerPane}>
      <p className={classes.answerPane__title}>Answer:</p>
      <div className={classes.answerPane__content}>
        {props.choices.map((choice, index) => <AnswerButton key={index} id={index} label={choice} onAnswer={props.onAnswer} />)}
      </div>
    </div>
  );
};

export default AnswerPane;