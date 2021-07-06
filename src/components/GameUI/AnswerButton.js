import classes from './AnswerButton.module.css';

const AnswerButton = (props) => {

  const clickHandler = (event) => {
    console.log(event);
    props.onAnswer(props.id);
  };

  return (
    <div className={classes.answerButton} onClick={clickHandler} >
      <p className={classes.answerButton__label} >
        {props.label}
      </p>
    </div>
  );
};

export default AnswerButton;