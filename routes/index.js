var express = require('express');
var charset = require('superagent-charset');
var request = require('superagent');
var EventProxy = require('eventproxy');
var cheerio = require('cheerio');
var caculate = require('./../utils/caculate').caculate;

var router = express.Router();
var ep = new EventProxy();
var ERROR_STRING = '帐号'; // 只要模拟登陆后返回的页面中有 ‘帐号’ 两个字，说明登陆失败
var ERROR_STRING_NUMBER = '你输入的证件号不存在，请您重新输入！';
var ERROR_STRING_PASSWORD = '您的密码不正确，请您重新输入！';
var ERROR_STRING_DATABASE = '数据库忙请稍候再试';
var REG_EXP_NUMBER = /^\d+$/;
var URL_LOGIN = 'http://202.115.47.141/loginAction.do'; // 登陆页面
// 本学期成绩。pageSize=100 参数主要是为了将所有成绩都显示在一页
var URL_CURRENT_TERM = 'http://202.115.47.141/bxqcjcxAction.do?pageSize=100';
var URL_ALL_PASS = 'http://202.115.47.141/gradeLnAllAction.do?type=ln&oper=qbinfo'; // 所有及格成绩
var URL_ALL_FAIL = 'http://202.115.47.141/gradeLnAllAction.do?type=ln&oper=bjg'; // 全部不及格成绩
charset(request);


/**
 * 首页
 */
router.get('/', function(req, res) {
  if (!req.session.user) {
    return res.redirect('/login');
  }
  res.render('index', {
    title: '四川大学绩点平均分一键计算'
  });
});


/**
 * 登陆页面
 */
router.get('/login', function(req, res) {
  res.render('index', {
    title: '四川大学绩点平均分一键计算'
  });
});


/**
 * 模拟登陆
 */
router.post('/login', function(req, res) {
  const number = req.body.number;
  const password = req.body.password;
  console.log('=================', number, password);
  if (!REG_EXP_NUMBER.test(number)) {
    return res.json({
      code: 1001,
      error: '学号错误'
    });
  }
  if (!REG_EXP_NUMBER.test(password)) {
    return res.json({
      code: 1002,
      error: '密码错误'
    });
  }

  // 模拟登陆教务系统
  request
  .get(URL_LOGIN + '?zjh=' + number + '&mm=' + password)
  .charset('gbk')
  .end(function(errLogin, resLogin) {
    if (errLogin) {
      console.log('errLogin ', errLogin);
      return res.json({
        code: 1003,
        error: '登陆失败',
        detail: errLogin
      });
    }
    // 判断是否登陆成功
    const $ = cheerio.load(resLogin.text, {
      ignoreWhitespace: true,
      xmlMode: false,
      lowerCaseTags: false
    });
    const loginResText = $('body').text().replace(/\s+/g, '');
    // console.log('resLogin: ', resLogin.text.replace(/\s+/g, ''));
    // console.log('loginResText: ', loginResText);
    // console.log(loginResText.indexOf(ERROR_STRING));
    if (loginResText.indexOf(ERROR_STRING) !== -1) {
      if (loginResText.indexOf(ERROR_STRING_NUMBER) !== -1) {
        return res.json({
          code: 1004,
          error: '学号错误'
        });
      }
      if (loginResText.indexOf(ERROR_STRING_PASSWORD) !== -1) {
        return res.json({
          code: 1005,
          error: '密码错误'
        });
      }
      return res.json({
        code: 1006,
        error: '学号或密码错误'
      });
    }

    const cookie = resLogin.header['set-cookie'];
    console.log(cookie);
    req.session.user = {
      cookie: cookie,
      number: number,
      password: password
    };
    console.log(req.session);
    return res.json({
      code: 0,
      data: {}
    });
  });
});


/**
 * 抓取教务系统中的成绩
 */
router.get('/grade', function(req, res) {
  console.log('/grade');
  // console.log(req.session);
  if (!req.session.user) {
    return res.json({
      code: 1100,
      error: '尚未登陆'
    });
  }
  const cookie = req.session.user.cookie;
  console.log('cookie: ', cookie);
  // 抓取到所有结果之后，执行下面的代码
  ep.all('currentTerm', 'allPass', 'allFail', function (currentTerm, allPass, allFail) {
    if (currentTerm[0]) {
      return res.json({
        code: 1201,
        error: '获取当前学期成绩错误，请重试'
      });
    }
    if (allPass[0]) {
      return res.json({
        code: 1202,
        error: '获取所有及格成绩错误，请重试'
      });
    }
    if (allFail[0]) {
      return res.json({
        code: 1203,
        error: '获取所有不及格成绩错误，请重试'
      });
    }

    return res.json({
      code: 0,
      data: {
        currentTerm: currentTerm[1],
        allPass: allPass[1],
        allFail: allFail[1]
      }
    });
  });

  // 抓取本学期成绩页面
  request
  .get(URL_CURRENT_TERM)
  .charset('gbk')
  .set('Cookie', cookie)
  .end(function(errCurrentTerm, resCurrentTerm) {
    if (errCurrentTerm) {
      console.log('[error] 抓取本学期成绩页面: ', errCurrentTerm);
      ep.emit('currentTerm', [errCurrentTerm, resCurrentTerm]);
    } else {
      const currentTermStart = resCurrentTerm.text.indexOf('<body');
      const currentTermEnd = resCurrentTerm.text.indexOf('</body');
      const currentTermText = resCurrentTerm.text.substring(currentTermStart, currentTermEnd);
      const $ = cheerio.load(currentTermText, {
        ignoreWhitespace: true,
        xmlMode: false,
        lowerCaseTags: false
      });
      // console.log('===========currentTermText: ', currentTermText);
      if (currentTermText.indexOf(ERROR_STRING_DATABASE) !== -1) {
        // 抓取失败，数据库忙，需要重新登陆抓取
        ep.emit('currentTerm', [ERROR_STRING_DATABASE, resCurrentTerm]);
      } else {
        const gradeTableTr = $('body').find('table[width="100%"]').eq(5).find('tr');
        const lengthGradeTableTr = gradeTableTr.length;
        const currentTermGrade = {}; // 本学期成绩
        currentTermGrade.gradeList = [];
        gradeTableTr.each(function(index) {
          // 排除表格行 tr 的第一项和最后一项
          if (index > 0 && index < lengthGradeTableTr - 1) {
            // console.log('===', index, $(this).find('td').eq(0).text());
            currentTermGrade.gradeList.push({
              courseNumber: $(this).find('td').eq(0).text()
                .replace(/\s+/g, ''), // 课程号
              lessonNumber: $(this).find('td').eq(1).text()
                .replace(/\s+/g, ''), // 课序号
              courseName: $(this).find('td').eq(2).text()
                .replace(/(^\s+)|(\s+$)/g, ''), // 课程名
              courseEnglishName: $(this).find('td').eq(3).text(), // 英文课程名
              credit: $(this).find('td').eq(4).text()
                .replace(/\s+/g, ''), // 学分
              courseProperty: $(this).find('td').eq(5).text()
                .replace(/\s+/g, ''), // 课程属性
              grade: $(this).find('td').eq(6).text()
                .replace(/\s+/g, '') // 成绩
            });
          }
        });
        // console.log('currentTermGrade: ', caculate(currentTermGrade.gradeList));
        // 获取绩点计算结果
        const caculateResult = caculate(currentTermGrade.gradeList);
        currentTermGrade.averageGpa = caculateResult.averageGpa;
        currentTermGrade.averageGrade = caculateResult.averageGrade;
        currentTermGrade.averageGpaObligatory = caculateResult.averageGpaObligatory;
        currentTermGrade.averageGradeObligatory = caculateResult.averageGradeObligatory;
        currentTermGrade.sumCredit = caculateResult.sumCredit;
        currentTermGrade.sumCreditObligatory = caculateResult.sumCreditObligatory;
        ep.emit('currentTerm', [errCurrentTerm, currentTermGrade]);
      }
    }
  });

  // 抓取所有及格成绩
  request
  .get(URL_ALL_PASS)
  .charset('gbk')
  .set('Cookie', cookie)
  .end(function(errAllPass, resAllPass) {
    console.log('抓取所有及格成绩...');
    if (errAllPass) {
      console.log('[error] 抓取所有及格成绩: ', errAllPass);
      ep.emit('allPass', [errAllPass, resAllPass]);
    } else {
      const allPassStart = resAllPass.text.indexOf('<body');
      const allPassEnd = resAllPass.text.indexOf('</body');
      const allPassText = resAllPass.text.substring(allPassStart, allPassEnd);
      const $ = cheerio.load(allPassText, {
        ignoreWhitespace: true,
        xmlMode: false,
        lowerCaseTags: false
      });
      // console.log('===========allPassText: ', allPassText);
      if (allPassText.indexOf(ERROR_STRING_DATABASE) !== -1) {
        // 抓取失败，数据库忙，需要重新登陆抓取
        ep.emit('allPass', [ERROR_STRING_DATABASE, allPassText]);
      } else {
        const gradeTable = $('body').find('table[class="titleTop2"]');
        // console.log('gradeTable: ', gradeTable.length);
        const allPassGradeList = {};
        allPassGradeList.gradeList = []; // 成绩列表
        gradeTable.each(function() {
          // 获取每一学期成绩
          // console.log($(this).prev().prev().text());
          const gradeList = {};
          gradeList.term = $(this).prev().prev().text()
            .replace(/\s+/g, '');
          gradeList.list = [];
          const gradeTableTr = $(this).find('table[id="user"] tr');
          gradeTableTr.each(function(index) {
            // 获取每一学期成绩中的每一项成绩
            if (index > 0) {
              gradeList.list.push({
                courseNumber: $(this).find('td').eq(0).text()
                  .replace(/\s+/g, ''), // 课程号
                lessonNumber: $(this).find('td').eq(1).text()
                  .replace(/\s+/g, ''), // 课序号
                courseName: $(this).find('td').eq(2).text()
                  .replace(/(^\s+)|(\s+$)/g, ''), // 课程名
                courseEnglishName: $(this).find('td').eq(3).text(), // 英文课程名
                credit: $(this).find('td').eq(4).text()
                  .replace(/\s+/g, ''), // 学分
                courseProperty: $(this).find('td').eq(5).text()
                  .replace(/\s+/g, ''), // 课程属性
                grade: $(this).find('td').eq(6).text()
                  .replace(/\s+/g, '') // 成绩
              });
            }
          });
          // 获取绩点计算结果
          const caculateResult = caculate(gradeList.list);
          gradeList.averageGpa = caculateResult.averageGpa;
          gradeList.averageGrade = caculateResult.averageGrade;
          gradeList.averageGpaObligatory = caculateResult.averageGpaObligatory;
          gradeList.averageGradeObligatory = caculateResult.averageGradeObligatory;
          gradeList.sumCredit = caculateResult.sumCredit;
          gradeList.sumCreditObligatory = caculateResult.sumCreditObligatory;
          allPassGradeList.gradeList.push(gradeList);
        });
        // 翻转数组，按学期倒序排列
        allPassGradeList.gradeList.reverse();
        ep.emit('allPass', [errAllPass, allPassGradeList]);
      }
    }
  });


  // 抓取所有不及格成绩
  request
  .get(URL_ALL_FAIL)
  .charset('gbk')
  .set('Cookie', cookie)
  .end(function(errAllFail, resAllFail) {
    if (errAllFail) {
      console.log('[error] 抓取所有及格成绩: ', errAllFail);
      ep.emit('allFail', [errAllFail, resAllFail]);
    } else {
      const allFailStart = resAllFail.text.indexOf('<body');
      const allFailEnd = resAllFail.text.indexOf('</body');
      const allFailText = resAllFail.text.substring(allFailStart, allFailEnd);
      const $ = cheerio.load(allFailText, {
        ignoreWhitespace: true,
        xmlMode: false,
        lowerCaseTags: false
      });
      // console.log('===========allFailText: ', allFailText);
      if (allFailText.indexOf(ERROR_STRING_DATABASE) !== -1) {
        // 抓取失败，数据库忙，需要重新登陆抓取
        ep.emit('allFail', [ERROR_STRING_DATABASE, allFailText]);
      } else {
        const currentFailTableTr = $('body').find('table[class="titleTop2"]').eq(0).find('table[id="user"] tr');
        const beforeFailTableTr = $('body').find('table[class="titleTop2"]').eq(1).find('table[id="user"] tr');
        const allFailGradeList = {};
        allFailGradeList.current = []; // 尚不及格
        allFailGradeList.before = []; // 曾不及格
        currentFailTableTr.each(function(index) {
          // console.log('currentFailTableTr: ', $(this).text());
          if (index > 0) {
            allFailGradeList.current.push({
              courseNumber: $(this).find('td').eq(0).text()
                .replace(/\s+/g, ''), // 课程号
              lessonNumber: $(this).find('td').eq(1).text()
                .replace(/\s+/g, ''), // 课序号
              courseName: $(this).find('td').eq(2).text()
                .replace(/(^\s+)|(\s+$)/g, ''), // 课程名
              courseEnglishName: $(this).find('td').eq(3).text(), // 英文课程名
              credit: $(this).find('td').eq(4).text()
                .replace(/\s+/g, ''), // 学分
              courseProperty: $(this).find('td').eq(5).text()
                .replace(/\s+/g, ''), // 课程属性
              grade: $(this).find('td').eq(6).text()
                .replace(/\s+/g, ''), // 成绩
              examDate: $(this).find('td').eq(7).text()
                .replace(/\s+/g, ''), // 考试时间
              failReason: $(this).find('td').eq(8).text()
                  .replace(/\s+/g, ''), // 未通过原因
            });
          }
        });
        beforeFailTableTr.each(function(index) {
          if (index > 0) {
            allFailGradeList.before.push({
              courseNumber: $(this).find('td').eq(0).text()
                .replace(/\s+/g, ''), // 课程号
              lessonNumber: $(this).find('td').eq(1).text()
                .replace(/\s+/g, ''), // 课序号
              courseName: $(this).find('td').eq(2).text()
                .replace(/\s+/g, ''), // 课程名
              courseEnglishName: $(this).find('td').eq(3).text(), // 英文课程名
              credit: $(this).find('td').eq(4).text()
                .replace(/\s+/g, ''), // 学分
              courseProperty: $(this).find('td').eq(5).text()
                .replace(/\s+/g, ''), // 课程属性
              grade: $(this).find('td').eq(6).text()
                .replace(/\s+/g, ''), // 成绩
              examDate: $(this).find('td').eq(7).text()
                .replace(/\s+/g, ''), // 考试时间
              failReason: $(this).find('td').eq(8).text()
                  .replace(/\s+/g, ''), // 未通过原因
            });
          }
        });
        ep.emit('allFail', [errAllFail, allFailGradeList]);
      }
    }
  });
});


/**
 * 退出登陆
 */
router.get('/logout', function(req, res) {
  req.session.destroy(function(err) {
    if (err) {
      console.log('log out fail: ', err);
      return res.redirect('/login');
    }
    res.redirect('/login');
  });
});


module.exports = router;
