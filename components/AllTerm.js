import React, { Component } from 'react';
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table';
import CaculateFunction from './CaculateFunction';

const styles = {
  borderBottom: {
    borderBottom: '1px solid rgb(224, 224, 224)'
  },
  borderTop: {
    borderTop: '1px solid rgb(224, 224, 224)'
  },
  textAlignCenter: {
    textAlign: 'center'
  },
  paper: {
    boxShadow: 'rgba(0, 0, 0, 0.156863) 0px 3px 10px, rgba(0, 0, 0, 0.227451) 0px 3px 10px',
    margin: '20px 10px',
  },
  heightAuto: {
    height: 'auto'
  },
  tableRowColumn40: {
    width: '40%',
    height: 'auto',
    whiteSpace: 'pre-wrap',
    overflow: 'visible'
  },
  tableRowColumn15: {
    width: '15%',
    height: 'auto',
    whiteSpace: 'pre-wrap',
    overflow: 'visible'
  }
};


class AllTerm extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
    console.log('init all term...');
    this.onTermRowSelection = this.onTermRowSelection.bind(this);
  }


  /**
   * 初始化所有学期通过的课程中的被选中状态为 false
   * 将其 selected 设置为 false
   */
  initAllPassNoSelected() {
    const termList = this.props.allPass.gradeList.map(function(term) {
      const currentTerm = term;
      currentTerm.list = term.list.map(function(item) {
        const grade = item;
        grade.selected = false;
        return grade;
      });
      return currentTerm;
    });
    console.log('initAllPassNoSelected: ', termList);
    return termList;
  }


  /**
   * 初始化所有尚不及格课程中的被选中状态为 false
   * 将其 selected 设置为 false
   */
  initCurrentFailNoSelected() {
    const gradeList = this.props.allFail.current.map(function(item) {
      const grade = item;
      grade.selected = false;
      return grade;
    });
    return gradeList;
  }


  /**
   * 初始化所有曾不及格课程中的被选中状态为 false
   * 将其 selected 设置为 false
   */
  initBeforeFailNoSelected() {
    const gradeList = this.props.allFail.before.map(function(item) {
      const grade = item;
      grade.selected = false;
      return grade;
    });
    return gradeList;
  }


  /**
   * 点击某个学期中的行 Row
   * @param {array} 被选中的行  [0,1,3] 选中第 0,1,3 行
   * @param {number} 被选中的学期 如 0 表示数组中第 0 个学期
   */
  onTermRowSelection(selectedRows, termIndex) {
    console.log('onTermRowSelection....');
    console.log('index: ', termIndex);
    const termList = this.initAllPassNoSelected();
    let selectedRowsData = []; // 被选中的所有行的数据
    if (typeof selectedRows === 'object') {
      // 选中的是一个数组，且数组长度大于0
      console.log('选中的是一个数组');
      selectedRowsData = selectedRows.map(function(item) {
        // 将 currentTerm.gradeList 中对应的 selected 设置为 true
        termList[termIndex].list[item].selected = true;
        // 返回被选中的 gradeList
        return termList[termIndex].list[item];
      });
    } else if (selectedRows === 'all') {
      // 选中了所有 row
      console.log('选中了所有 row...');
      selectedRowsData = termList[termIndex].list;
    } else if (selectedRows === 'none') {
      // 取消选中所有行
      console.log('取消选中所有行...');
      selectedRowsData = [];
    }
    console.log('selectedRowsData: ', selectedRowsData);
    // 调用父组建的 getSelectedRowsData
    this.props.getSelectedAllPassData(selectedRowsData, termIndex);
  }


  /**
   * 点击尚不及格中的行 Row
   * @param {array} selectedRows 被选中的行  [0,1,3] 选中第 0,1,3 行
   */
  onCurrentFailRowSelection(selectedRows) {
    const gradeList = this.initCurrentFailNoSelected();
    console.log('onCurrentFailRowSelection gradeList: ', gradeList);
    let selectedRowsData = []; // 被选中的所有行的数据
    if (typeof selectedRows === 'object') {
      // 选中的是一个数组，且数组长度大于0
      console.log('选中的是一个数组');
      selectedRowsData = selectedRows.map(function(item) {
        // 将 currentTerm.gradeList 中对应的 selected 设置为 true
        gradeList[item].selected = true;
        // 返回被选中的 gradeList
        return gradeList[item];
      });
    } else if (selectedRows === 'all') {
      // 选中了所有 row
      console.log('选中了所有 row...');
      selectedRowsData = gradeList;
    } else if (selectedRows === 'none') {
      // 取消选中所有行
      console.log('取消选中所有行...');
      selectedRowsData = [];
    }
    console.log('selectedRowsData: ', selectedRowsData);
    // 调用父组建的 getSelectedCurrentFailData
    this.props.getSelectedCurrentFailData(selectedRowsData);
  }


  /**
   * 点击曾不及格中的行 Row
   * @param {array} selectedRows 被选中的行  [0,1,3] 选中第 0,1,3 行
   */
  onBeforeFailRowSelection(selectedRows) {
    const gradeList = this.initBeforeFailNoSelected();
    let selectedRowsData = []; // 被选中的所有行的数据
    if (typeof selectedRows === 'object') {
      // 选中的是一个数组，且数组长度大于0
      console.log('选中的是一个数组');
      selectedRowsData = selectedRows.map(function(item) {
        // 将 currentTerm.gradeList 中对应的 selected 设置为 true
        gradeList[item].selected = true;
        // 返回被选中的 gradeList
        return gradeList[item];
      });
    } else if (selectedRows === 'all') {
      // 选中了所有 row
      console.log('选中了所有 row...');
      selectedRowsData = gradeList;
    } else if (selectedRows === 'none') {
      // 取消选中所有行
      console.log('取消选中所有行...');
      selectedRowsData = [];
    }
    console.log('selectedRowsData: ', selectedRowsData);
    // 调用父组建的 getSelectedBeforeFailData
    this.props.getSelectedBeforeFailData(selectedRowsData);
  }


  render() {
    // 所有及格成绩（所有学期的成绩）
    let passDom = '';
    if (this.props.allPass) {
      passDom = this.props.allPass.gradeList.map(function(term, termIndex) {
        let tableRowsPassDom = '';
        let averagePassDom = '';
        tableRowsPassDom = term.list.map(function(item, index) {
          return (
            <TableRow key={index} selected={item.selected} style={styles.heightAuto}>
              {/* <TableRowColumn>{item.courseNumber}</TableRowColumn> */}
              {/* <TableRowColumn>{item.lessonNumber}</TableRowColumn> */}
              <TableRowColumn style={styles.tableRowColumn40}>{item.courseName}</TableRowColumn>
              <TableRowColumn style={styles.tableRowColumn15}>{item.credit}</TableRowColumn>
              <TableRowColumn style={styles.tableRowColumn15}>{item.courseProperty}</TableRowColumn>
              <TableRowColumn style={styles.tableRowColumn15}>{item.grade}</TableRowColumn>
              <TableRowColumn style={styles.tableRowColumn15}>
                {CaculateFunction.changeGradeToPoint(item.grade)}
              </TableRowColumn>
            </TableRow>
          );
        });
        averagePassDom = (
          <div>
            <Table selectable={false}>
              <TableBody displayRowCheckbox={false}>
                <TableRow displayBorder={true}>
                  <TableRowColumn colSpan='2' style={styles.textAlignCenter}>
                    <h3>{term.term}</h3>
                  </TableRowColumn>
                </TableRow>
                <TableRow displayBorder={false}>
                  <TableRowColumn>全部绩点: {term.averageGpa}</TableRowColumn>
                  <TableRowColumn>
                    必修绩点: {term.averageGpaObligatory}
                  </TableRowColumn>
                </TableRow>
                <TableRow displayBorder={false} style={styles.borderBottom}>
                  <TableRowColumn>全部平均分: {term.averageGrade}</TableRowColumn>
                  <TableRowColumn>
                    必修平均分: {term.averageGradeObligatory}
                  </TableRowColumn>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        );
        return (
          <div style={styles.paper} key={termIndex}>
            {averagePassDom}
            <Table multiSelectable={true} fixedFooter={true}
              onRowSelection={ (selectedRows) => this.onTermRowSelection(selectedRows, termIndex)}
            >
              <TableHeader enableSelectAll={true} displaySelectAll={true}>
                <TableRow>
                  {/* <TableHeaderColumn>课程号</TableHeaderColumn> */}
                  {/* <TableHeaderColumn>课序号</TableHeaderColumn> */}
                  <TableHeaderColumn style={{ width: '40%' }}>课程名</TableHeaderColumn>
                  <TableHeaderColumn style={{ width: '15%' }}>学分</TableHeaderColumn>
                  <TableHeaderColumn style={{ width: '15%' }}>课程属性</TableHeaderColumn>
                  <TableHeaderColumn style={{ width: '15%' }}>成绩</TableHeaderColumn>
                  <TableHeaderColumn style={{ width: '15%' }}>绩点</TableHeaderColumn>
                </TableRow>
              </TableHeader>
              <TableBody deselectOnClickaway={false}>
                {tableRowsPassDom}
              </TableBody>
            </Table>
          </div>
        );
      }.bind(this));
    }

    // 尚不及格
    let currentFailDom = '';
    if (this.props.allFail && this.props.allFail.current) {
      let averageDom = '';
      let tableRowsDom = '';
      tableRowsDom = this.props.allFail.current.map(function(item, index) {
        return (
          <TableRow key={index} selected={item.selected} style={styles.heightAuto}>
            <TableRowColumn style={styles.tableRowColumn40}>{item.courseName}</TableRowColumn>
            <TableRowColumn style={styles.tableRowColumn15}>{item.credit}</TableRowColumn>
            <TableRowColumn style={styles.tableRowColumn15}>{item.courseProperty}</TableRowColumn>
            <TableRowColumn style={styles.tableRowColumn15}>{item.examDate}</TableRowColumn>
            <TableRowColumn style={styles.tableRowColumn15}>{item.grade}</TableRowColumn>
          </TableRow>
        );
      });
      averageDom = (
        <div>
          <Table selectable={false}>
            <TableBody displayRowCheckbox={false}>
              <TableRow displayBorder={true} style={styles.borderBottom}>
                <TableRowColumn colSpan='2' style={styles.textAlignCenter}>
                  <h3>尚不及格</h3>
                </TableRowColumn>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      );
      currentFailDom = (
        <div style={styles.paper}>
          {averageDom}
          <Table multiSelectable={true} fixedFooter={true}
            onRowSelection={ (selectedRows) => this.onCurrentFailRowSelection(selectedRows)}
          >
            <TableHeader enableSelectAll={true} displaySelectAll={true}>
              <TableRow>
                <TableHeaderColumn style={{ width: '40%' }}>课程名</TableHeaderColumn>
                <TableHeaderColumn style={{ width: '15%' }}>学分</TableHeaderColumn>
                <TableHeaderColumn style={{ width: '15%' }}>课程属性</TableHeaderColumn>
                <TableHeaderColumn style={{ width: '15%' }}>考试时间</TableHeaderColumn>
                <TableHeaderColumn style={{ width: '15%' }}>成绩</TableHeaderColumn>
              </TableRow>
            </TableHeader>
            <TableBody deselectOnClickaway={false}>
              {tableRowsDom}
            </TableBody>
          </Table>
        </div>
      );
    }

    // 曾不及格
    let beforeFailDom = '';
    if (this.props.allFail && this.props.allFail.before) {
      let averageDom = '';
      let tableRowsDom = '';
      tableRowsDom = this.props.allFail.before.map(function(item, index) {
        return (
          <TableRow key={index} selected={item.selected} style={styles.heightAuto}>
            <TableRowColumn style={styles.tableRowColumn40}>{item.courseName}</TableRowColumn>
            <TableRowColumn style={styles.tableRowColumn15}>{item.credit}</TableRowColumn>
            <TableRowColumn style={styles.tableRowColumn15}>{item.courseProperty}</TableRowColumn>
            <TableRowColumn style={styles.tableRowColumn15}>{item.examDate}</TableRowColumn>
            <TableRowColumn style={styles.tableRowColumn15}>{item.grade}</TableRowColumn>
          </TableRow>
        );
      });
      averageDom = (
        <div>
          <Table selectable={false}>
            <TableBody displayRowCheckbox={false}>
              <TableRow displayBorder={true} style={styles.borderBottom}>
                <TableRowColumn colSpan='2' style={styles.textAlignCenter}>
                  <h3>曾不及格</h3>
                </TableRowColumn>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      );
      beforeFailDom = (
        <div style={styles.paper}>
          {averageDom}
          <Table multiSelectable={true} fixedFooter={true}
            onRowSelection={ (selectedRows) => this.onBeforeFailRowSelection(selectedRows)}
          >
            <TableHeader enableSelectAll={true} displaySelectAll={true}>
              <TableRow>
                <TableHeaderColumn style={{ width: '40%' }}>课程名</TableHeaderColumn>
                <TableHeaderColumn style={{ width: '15%' }}>学分</TableHeaderColumn>
                <TableHeaderColumn style={{ width: '15%' }}>课程属性</TableHeaderColumn>
                <TableHeaderColumn style={{ width: '15%' }}>考试时间</TableHeaderColumn>
                <TableHeaderColumn style={{ width: '15%' }}>成绩</TableHeaderColumn>
              </TableRow>
            </TableHeader>
            <TableBody deselectOnClickaway={false}>
              {tableRowsDom}
            </TableBody>
          </Table>
        </div>
      );
    }

    return (
      <div>
        {passDom}
        {currentFailDom}
        {beforeFailDom}
      </div>
    );
  }
}


export default AllTerm;
