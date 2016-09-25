## Branches

+ Node.js + React.js [https://github.com/nodejh/scugpa/tree/master](https://github.com/nodejh/scugpa/tree/master)
+ PHP5 [https://github.com/nodejh/scugpa/tree/php5](https://github.com/nodejh/scugpa/tree/php5)


## Links

ONLINE: [http://gpa.fyscu.com](http://gpa.fyscu.com)

TEST: [http://gpa.nodejh.com](http://gpa.nodejh.com)

## Quick Start

```
$ git clone https://github.com/nodejh/scugpa
$ cd scugpa
$ npm install
$ npm start
```

Then open `localhost:3003` in youer browser.


## 计算方法

加权平均分 = ∑(成绩 * 课程学分) / ∑课程学分

绩点 = ∑(绩点 * 课程学分) / ∑课程学分

## 百分之成绩与绩点对照表

|||||||||||
|:---:|:---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
|百分制成绩 |100~95|	94~90|	89~85|	84~80|	79~75|	74~70|	69~65|	64~60|	<60|
|成绩绩点	|4	|3.8	|3.6	|3.2	|2.7	|2.2	|1.7 |1	|0 |

## 等级转换为百分制成绩和绩点对照表

|||||||
|:---:|:---|:---:|:---:|:---:|:---:|
|等级成绩	|优秀	|良好	|中等	|通过	|未通过|
|百分制成绩	|95	|85	|75	|60	|0 |
|成绩绩点	|4	|3.6	|2.7	|1	|0 |


## 关于形势与政策

每个学期的形势与政策学分为 0.25 分。

## 关于不及格成绩的处理

对于必修不及格成绩，不同学院有不同计算方式，大概有三种：

+ 一是按照第一次期末的成绩进行计算；
+ 二是如果补考过了按照补考成绩计算，
+ 三是补考没过重修过了按照重修成绩计算。

在该绩点计算器中，
+ 对于当前学期成绩，计算了不及格成绩；
+ 对于每学期的成绩，没有计算不及格成绩。
