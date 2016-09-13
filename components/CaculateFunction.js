// const obligatory
const STRING_OBLIGATORY = '必修';
const REG_EXP_GRADE = /^(\d{1,4}\.\d{1,3}|\d{1,4})$/;
// REGULAR_Expressions


//
/**
 * 保留小数点
 */
const fomatFloat = function(number, position) {
  return Math.round(number * Math.pow(10, position)) / Math.pow(10, position);
};


/**
 * 转换成绩
 */
const changeGrade = function(grade) {
  if (REG_EXP_GRADE.test(grade)) {
    return parseFloat(grade);
  }
  switch (grade) {
    case '优秀':
      return 95;
    case '良好':
      return 85;
    case '中等':
      return 75;
    case '通过':
      return 60;
    case '未通过':
      return 0;
    default:
      return 0;
  }
};


/**
 * 转换学分
 * 形势与政策学分为 0.25
 */
const changeCredit = function(credit) {
  if (parseFloat(credit) !== 0) {
    return parseFloat(credit);
  }
  return 0.25;
};


/**
 * 将成绩转换为对应的绩点
 */
const changeGradeToPoint = function(grade) {
  const newGrade = changeGrade(grade);
  if (newGrade >= 95 && newGrade <= 100) {
    return 4;
  } else if (newGrade >= 90 && newGrade < 95) {
    return 3.8;
  } else if (newGrade >= 85 && newGrade < 90) {
    return 3.6;
  } else if (newGrade >= 80 && newGrade < 85) {
    return 3.2;
  } else if (newGrade >= 75 && newGrade < 80) {
    return 2.7;
  } else if (newGrade >= 70 && newGrade < 75) {
    return 2.2;
  } else if (newGrade >= 65 && newGrade < 70) {
    return 1.7;
  } else if (newGrade >= 60 && newGrade < 65) {
    return 1;
  } else if (newGrade < 60) {
    return 0;
  }
};


// const isOBLIGATORY function
const isObligatory = function(string) {
  if (string === STRING_OBLIGATORY) {
    return true;
  }
  return false;
};


/**
 * 计算绩点、平均分
 * 传入一个对象，对象里面是包含绩点、成绩、课程属性的一个数组
 */
const caculate = function(grades) {
  let sumCredit = 0; // 所有学分之和
  let sumPointMultiplyCredit = 0; // 所有绩点 * 课程学分之和
  let sumGradeMultiplyCredit = 0; // 所有成绩 * 课程成绩之和
  let sumCreditObligatory = 0; // 必修学分之和
  let sumPointMultiplyCreditObligatory = 0; // 绩点 * 课程学分之和
  let sumGradeMultiplyCreditObligatory = 0; // 必修成绩 * 课程成绩之和

  grades.forEach(function(item) {
    sumCredit += changeCredit(item.credit);
    sumPointMultiplyCredit += changeGradeToPoint(item.grade) * changeCredit(item.credit);
    sumGradeMultiplyCredit += changeGrade(item.grade) * changeCredit(item.credit);

    if (isObligatory(item.courseProperty)) {
      sumCreditObligatory +=
        changeCredit(item.credit);
      sumPointMultiplyCreditObligatory +=
        changeGradeToPoint(item.grade) * changeCredit(item.credit);
      sumGradeMultiplyCreditObligatory +=
        changeGrade(item.grade) * changeCredit(item.credit);
    }
  });
  // console.log('sumCredit: ', sumCredit);
  // console.log('sumPointMultiplyCredit: ', sumPointMultiplyCredit);
  // console.log('sumGradeMultiplyCredit: ', sumGradeMultiplyCredit);
  return {
    averageGpa: fomatFloat(sumPointMultiplyCredit / sumCredit, 3),
    averageGrade: fomatFloat(sumGradeMultiplyCredit / sumCredit, 3),
    averageGpaObligatory: fomatFloat(sumPointMultiplyCreditObligatory / sumCreditObligatory, 3),
    averageGradeObligatory: fomatFloat(sumGradeMultiplyCreditObligatory / sumCreditObligatory, 3),
    sumCredit: sumCredit,
    sumCreditObligatory: sumCreditObligatory
  };
};

const caculateFunction = {
  changeGradeToPoint: changeGradeToPoint,
  caculate: caculate
};

export default caculateFunction;
