import AnswerButton from "./AnswerButton";

import './AnswerPane.css';

const AnswerPane = (props) => {
  return (
    <div className='answer-pane'>
      <p className='answer-pane__title'>Answer:</p>
      <div className='answer-pane__content'>
        {props.choices.map((choice, index) => <AnswerButton key={index} label={choice} onSubmit={props.onSubmit} />)}
      </div>
    </div>
  );
};

export default AnswerPane;