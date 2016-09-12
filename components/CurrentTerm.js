import React, { Component } from 'react';
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table';
import { changeGradeToPoint } from './../utils/caculate';

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
    margin: '10px',
    backgroundColor: 'red'
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


class CurrentTerm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentTerm: this.props.currentTerm,
      selectedRowsData: []
    };
    this.onRowSelection = this.onRowSelection.bind(this);
  }


  /**
   * 初始化 gradeList
   * 将其 selected 设置为 false
   */
  initGradeListNoSelected() {
    const gradeList = this.state.currentTerm.gradeList.map(function(item) {
      const grade = item;
      grade.selected = false;
      return grade;
    });
    return gradeList;
  }


  onRowSelection(selectedRows) {
    const gradeList = this.initGradeListNoSelected();
    let selectedRowsData = []; // 被选中的所有行的数据
    if (typeof selectedRows === 'object') {
      // 选中的是一个数组，且数组长度大于0
      // console.log('选中的是一个数组');
      selectedRowsData = selectedRows.map(function(item) {
        // 将 currentTerm.gradeList 中对应的 selected 设置为 true
        gradeList[item].selected = true;
        // 返回被选中的 gradeList
        return gradeList[item];
      });
    } else if (selectedRows === 'all') {
      // 选中了所有 row
      // console.log('选中了所有 row...');
      selectedRowsData = gradeList;
    } else if (selectedRows === 'none') {
      // 取消选中所有行
      // console.log('取消选中所有行...');
      selectedRowsData = [];
    }
    // console.log('selectedRowsData: ', selectedRowsData);
    // 调用父组建的 getSelectedRowsData
    this.props.getSelectedRowsData(selectedRowsData);
  }


  render() {
    // console.log('this state', this.state);

    let tableRowsDom = '';
    let averageDom = '';
    if (this.state.currentTerm) {
      tableRowsDom = this.state.currentTerm.gradeList.map(function(item, index) {
        return (
          <TableRow key={index} selected={item.selected} style={styles.heightAuto}>
            {/* <TableRowColumn>{item.courseNumber}</TableRowColumn> */}
            {/* <TableRowColumn>{item.lessonNumber}</TableRowColumn> */}
            <TableRowColumn style={styles.tableRowColumn40}>{item.courseName}</TableRowColumn>
            <TableRowColumn style={styles.tableRowColumn15}>{item.credit}</TableRowColumn>
            <TableRowColumn style={styles.tableRowColumn15}>{item.courseProperty}</TableRowColumn>
            <TableRowColumn style={styles.tableRowColumn15}>{item.grade}</TableRowColumn>
            <TableRowColumn style={styles.tableRowColumn15}>
              {changeGradeToPoint(item.grade)}
            </TableRowColumn>
          </TableRow>
        );
      });

      averageDom = (
        <div>
          <Table selectable={false}>
            <TableBody displayRowCheckbox={false}>
              <TableRow displayBorder={true}>
                <TableRowColumn colSpan='2' style={styles.textAlignCenter}>
                  <h3>本学期成绩</h3>
                </TableRowColumn>
              </TableRow>
              <TableRow displayBorder={false}>
                <TableRowColumn>全部绩点: {this.state.currentTerm.averageGpa}</TableRowColumn>
                <TableRowColumn>
                  必修绩点: {this.state.currentTerm.averageGpaObligatory}
                </TableRowColumn>
              </TableRow>
              <TableRow displayBorder={false} style={styles.borderBottom}>
                <TableRowColumn>全部平均分: {this.state.currentTerm.averageGrade}</TableRowColumn>
                <TableRowColumn>
                  必修平均分: {this.state.currentTerm.averageGradeObligatory}
                </TableRowColumn>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      );
    }

    return (
      <div>
        <div style={styles.paper}>
          {averageDom}
          <Table multiSelectable={true} fixedFooter={true}
            onRowSelection={ (selectedRows) => this.onRowSelection(selectedRows)}
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
              {tableRowsDom}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  }
}


export default CurrentTerm;
