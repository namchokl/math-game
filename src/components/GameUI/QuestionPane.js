import './QuestionPane.css';

const QuestionPane = (props) => {
  return (
    <div className='question-pane'>
      <p className='question-pane__title'>{`Question #${props.number} of ${props.total}`}</p>
      <p className='question-pane__content'>{props.question}</p>
    </div>
  );
};

export default QuestionPane;