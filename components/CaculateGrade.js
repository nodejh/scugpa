
import React, { Component } from 'react';
import { Icon } from 'react-fa';
import Dialog from 'material-ui/Dialog';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import FlatButton from 'material-ui/FlatButton';
import CaculateFunction from './CaculateFunction';


const styles = {
  container: {

  },
  caculate: {
    margin: 0,
    top: 'auto',
    right: 20,
    bottom: 30,
    left: 'auto',
    position: 'fixed',
    zIndex: 999
  },
  diglogItem: {
    marginBottom: 10
  }
};


class CaculateGrade extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      title: '',
      gradeLength: 0,
      caculateResult: {}
    };
    this.handleOpen = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.onClickCaculate = this.onClickCaculate.bind(this);
  }


  handleOpen(title) {
    this.setState({ open: true, title: title });
  }


  handleClose() {
    this.setState({ open: false });
  }


  onClickCaculate() {
    console.log('caculate onClickCaculate ....');
    console.log('grade: ', this.props.grade);
    const grade = this.props.grade.filter(function(item) {
      return item !== undefined;
    });
    console.log('caculate grade: ', grade);
    if (grade.length > 0) {
      const caculateResult = CaculateFunction.caculate(grade);
      console.log(caculateResult);
      this.setState({
        caculateResult: caculateResult,
        open: true,
        gradeLength: grade.length,
        title: '您一共选择了 ' + grade.length + ' 门课程'
      });
      // this.handleOpen('您一共选择了 ' + grade.length + ' 门课程');
    } else {
      this.setState({
        gradeLength: 0
      });
      this.handleOpen('请选择要计算的课程');
    }
  }

  render() {
    const actions = [
      <FlatButton
        label='确定'
        primary={true}
        keyboardFocused={true}
        onTouchTap={this.handleClose}
      />
    ];
    let caculateResultDom = '';
    console.log('caculateResult: ', this.state.caculateResult);
    const caculateResult = this.state.caculateResult;
    if (this.state.open && this.state.gradeLength > 0) {
      console.log('cccc');
      // dialog is open and caculateResult.averageGpa is not undefined
      caculateResultDom = (
        <div>
          <div style={styles.diglogItem}>总学分: {caculateResult.sumCredit}</div>
          <div style={styles.diglogItem}>平均绩点: {caculateResult.averageGpa}</div>
          <div style={styles.diglogItem}>平均分数: {caculateResult.averageGrade}</div>
        </div>
      );
    }
    return (
      <div>
        <FloatingActionButton
          onClick={this.onClickCaculate}
          mini={true}
          secondary={true}
          style={styles.caculate}>
          <Icon name='calculator' />
        </FloatingActionButton>
        <Dialog
          title={this.state.title}
          actions={actions}
          modal={true}
          open={this.state.open}
          onRequestClose={this.handleClose}>
          {caculateResultDom}
        </Dialog>
      </div>
    );
  }
}


export default CaculateGrade;
