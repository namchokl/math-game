export const mathGenerators = {
  add( maxOperant=10 ) {
    let x1, x2, sum, question;

    x1 = Math.round(Math.random() * maxOperant);
    x2 = Math.round(Math.random() * maxOperant);
    sum = x1 + x2;
    question = `${x1} + ${x2} = ?`;

    return {
      question,
      ans: sum
    };
  },
  minus( maxOperant=10 ) {
    let x1, x2, minus, question;

    x1 = Math.round(Math.random() * maxOperant);
    x2 = Math.round(Math.random() * maxOperant);
    if( x1 < x2 ) {
      const t = x1;
      x1 = x2;
      x2 = t;
    }

    minus = x1 - x2;
    question = `${x1} − ${x2} = ?`;

    return {
      question,
      ans: minus
    };
  },
  multiply( maxOperant=10 ) {
    let x1, x2, ans, question;

    x1 = Math.round(Math.random() * maxOperant);
    x2 = Math.round(Math.random() * maxOperant);

    ans = x1 * x2;
    question = `${x1} × ${x2} = ?`;

    return {
      question,
      ans: ans
    };
  },
  divide( maxOperant=10 ) {
    let x1, x2, multiply, question;

    x1 = Math.round(Math.random() * maxOperant);
    x2 = Math.round(Math.random() * (maxOperant-1) + 1);

    multiply = x1 * x2;

    question = `${multiply} ÷ ${x2} = ?`;

    return {
      question,
      ans: x1
    };
  }
};

export const mathGeneratorList = [
  mathGenerators.add,
  mathGenerators.minus,
  mathGenerators.multiply,
  mathGenerators.divide,
];
// for( let item of mathGenerators ) {
//   mathGeneratorList.push( item );
// };