import classes from './QuestionPane.module.css';

const QuestionPane = (props) => {
  return (
    <div className={classes.questionPane}>
      <p className={classes.questionPane__title}>{`Question #${props.number} of ${props.total}`}</p>
      <p className={classes.questionPane__content}>{props.question}</p>
    </div>
  );
};

export default QuestionPane;