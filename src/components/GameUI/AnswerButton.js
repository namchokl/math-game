import './AnswerButton.css';

const AnswerButton = (props) => {

  const clickHandler = (event) => {
    console.log(event);
    // event.target.parentElement.blur();
    // event.target.blur();
    // props.onSubmit.bind(null, props.label)
    props.onSubmit(props.label)
  };

  return (
    <div className='answer-button' onClick={clickHandler} >
      <p className='answer-button__label' >
        {props.label}
      </p>
      {/* <div className='answer-button__click-area' ></div> */}
    </div>
  );
};

export default AnswerButton;