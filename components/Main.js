import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import { Tabs, Tab } from 'material-ui/Tabs';
import SwipeableViews from 'react-swipeable-views';
import AppBarIconMenu from './AppBarIconMenu';
import RefreshIndicatorLoading from './RefreshIndicator';
import CurrentTerm from './CurrentTerm';
import AllTerm from './AllTerm';
import Tips from './Tips';
import CaculateGrade from './CaculateGrade';
import ArrayFunction from './ArrayFunction';


const URL_GET_GRADE = '/grade';


const styles = {
  loading: {
    // display: 'flex',
    // justifyContent: 'center'
  },
  taps: {

  },
  swiperView: {
    marginTop: '20px',
    marginBottom: '50px',
  },
  headline: {
    fontSize: 24,
    paddingTop: 16,
    marginBottom: 12,
    fontWeight: 400,
  },
  slide: {
    padding: 10,
  },
};


class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      open: false,
      title: '',
      slideIndex: 0,
      selectedRowsData: [], // 被选中的所有成绩
      selectedAllPassData: [], // 二维数组。一维是被选中的所有及格成绩的学期数组。二维是每学期中被选中的
      selectedCurrentFailData: [], // 尚不及格
      selectedBeforeFailData: [], // 曾不及格
    };
    this.getGrade = this.getGrade.bind(this);
    this.handleOpenDialog = this.handleOpenDialog.bind(this);
    this.handleCloseDialog = this.handleCloseDialog.bind(this);
    this.handleChangeTab = this.handleChangeTab.bind(this);
    this.getSelectedRowsData = this.getSelectedRowsData.bind(this);
    this.getSelectedAllPassData = this.getSelectedAllPassData.bind(this);
    this.getSelectedCurrentFailData = this.getSelectedCurrentFailData.bind(this);
    this.getSelectedBeforeFailData = this.getSelectedBeforeFailData.bind(this);
    // this.setSelectedRowsData = this.setSelectedRowsData.bind(this);
  }


  componentWillMount() {
    this.getGrade();
  }


  handleOpenDialog(title) {
    this.setState({
      title: title,
      open: true,
    });
  }


  handleCloseDialog() {
    this.setState({ open: false });
    browserHistory.push('/login');
  }

  handleChangeTab(value) {
    this.setState({
      slideIndex: value,
      selectedRowsData: [], // 同时清空所有已被选择的 row data
    });
  }


  /**
   * 获取成绩
   */
  getGrade() {
    fetch(URL_GET_GRADE, {
      method: 'get',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then((response) => response.json())
    .then((responseJson) => {
      console.log('responseJson: ', responseJson);
      if (responseJson.code === 0) {
        this.setState({
          data: responseJson.data,
          isLoading: false
        });
      } else {
        this.setState({
          isLoading: false
        });
        this.handleOpenDialog(responseJson.error);
      }
    })
    .catch((error) => {
      console.error(error);
    });
  }


  /**
   * 获取被选中的成绩
   * @param {array} grade 被选中的成绩，主要用于当前学期的所选中的成绩的计算
   */
  getSelectedRowsData(grade) {
    // console.log('main Page getSelectedRowsData...');
    console.log(grade);
    this.setState({
      selectedRowsData: grade
    });
  }


  /**
   * 获取被选中的 allPass 中的成绩
   * @param {string} grade 被选中的allPass 中的成绩一维数组
   * @param {number} termIndex 被选中的学期的 index
   */
  getSelectedAllPassData(grade, termIndex) {
    console.log('main Page getSelectedAllPassData...');
    console.log(grade);
    console.log(termIndex);
    const selectedAllPassData = this.state.selectedAllPassData;
    selectedAllPassData[termIndex] = grade;
    // this.setState({
    //   selectedAllPassData: selectedAllPassData,
    // });
    console.log('selectedAllPassData: ', selectedAllPassData);
    // this.setSelectedRowsData();
    // 合并为一维数组后的被选中的allPass 中的成绩
    const selectedAllPassDataArray =
      ArrayFunction.reduceDimension(selectedAllPassData);
    const selectedCurrentFailData = this.state.selectedCurrentFailData;
    const selectedBeforeFailData = this.state.selectedBeforeFailData;
    const selectedRowsData = ArrayFunction.reduceDimension(
      [selectedAllPassDataArray, selectedCurrentFailData, selectedBeforeFailData]);
    console.log('设置被选中的成绩 allPass...');
    console.log(selectedAllPassDataArray, selectedCurrentFailData, selectedBeforeFailData);
    console.log('selectedRowsData: ', selectedRowsData);
    this.setState({
      selectedAllPassData: selectedAllPassData,
      selectedRowsData: selectedRowsData
    });
  }


  /**
   * 获取被选中的 尚不及格 成绩
   * @param {array} grade 被选中的尚不及格成绩一维数组
   */
  getSelectedCurrentFailData(grade) {
    console.log('main Page getSelectedCurrentFailData...');
    // console.log(grade);
    // this.setState({
    //   selectedCurrentFailData: grade,
    // });
    console.log('selectedCurrentFailData: ', grade);
    // this.setSelectedRowsData();
    const selectedAllPassData = ArrayFunction.reduceDimension(this.state.selectedAllPassData);
    const selectedCurrentFailData = grade;
    const selectedBeforeFailData = this.state.selectedBeforeFailData;
    const selectedRowsData = ArrayFunction.reduceDimension(
      [selectedAllPassData, selectedCurrentFailData, selectedBeforeFailData]);
    console.log('设置被选中的成绩...');
    console.log(selectedAllPassData, selectedCurrentFailData, selectedBeforeFailData);
    console.log('selectedRowsData: ', selectedRowsData);
    this.setState({
      selectedCurrentFailData: grade,
      selectedRowsData: selectedRowsData
    });
  }


  /**
   * 获取被选中的 曾不及格 成绩
   * @param {array} grade 被选中的曾不及格成绩一维数组
   */
  getSelectedBeforeFailData(grade) {
    console.log('main Page getSelectedBeforeFFailData...');
    // console.log(grade);
    // this.setState({
    //   selectedBeforeFailData: grade,
    // });
    console.log('selectedBeforeFailData: ', grade);
    // this.setSelectedRowsData();
    const selectedAllPassData = ArrayFunction.reduceDimension(this.state.selectedAllPassData);
    const selectedCurrentFailData = this.state.selectedCurrentFailData;
    const selectedBeforeFailData = grade;
    const selectedRowsData = ArrayFunction.reduceDimension(
      [selectedAllPassData, selectedCurrentFailData, selectedBeforeFailData]);
    console.log('设置被选中的成绩...');
    console.log(selectedAllPassData, selectedCurrentFailData, selectedBeforeFailData);
    console.log('selectedRowsData: ', selectedRowsData);
    this.setState({
      selectedBeforeFailData: grade,
      selectedRowsData: selectedRowsData
    });
  }


  render() {
    console.log('main this state: ', this.state);
    const actions = [
      <FlatButton
        label="确定"
        primary={true}
        onTouchTap={this.handleCloseDialog}
      />
    ];

    let currentTermDom = ''; // 当前学期
    let allTermDom = ''; // 所有学期成绩(及格+不及格)
    let tipsDom = ''; // 使用前必读
    if (this.state.data) {
      switch (this.state.slideIndex) {
        case 0:
          currentTermDom = (
            <CurrentTerm
              currentTerm={this.state.data.currentTerm}
              getSelectedRowsData={this.getSelectedRowsData} />
          );
          break;
        case 1:
          allTermDom = (
            <AllTerm
              allPass={this.state.data.allPass}
              allFail={this.state.data.allFail}
              getSelectedAllPassData={this.getSelectedAllPassData}
              getSelectedCurrentFailData={this.getSelectedCurrentFailData}
              getSelectedBeforeFailData={this.getSelectedBeforeFailData} />
          );
          break;
        case 2:
          tipsDom = (
            <Tips />
          );
          break;
        default:
      }
    }

    return (
      <div>
        <AppBarIconMenu />
        { this.state.isLoading &&
          <div style={styles.loading}>
            <RefreshIndicatorLoading initSize='30' initLeft='0' initTop='100' initStatus='loading' />
          </div>
        }
        <CaculateGrade grade={this.state.selectedRowsData} />

        <Tabs
          style={styles.taps}
          onChange={this.handleChangeTab}
          value={this.state.slideIndex}
        >
          <Tab label="本学期成绩" value={0} />
          <Tab label="所有学期成绩" value={1} />
          <Tab label="使用前必读" value={2} />
        </Tabs>

        <SwipeableViews
          style={styles.swiperView}
          index={this.state.slideIndex}
          onChangeIndex={this.handleChangeTab}
        >
          <div>
            {currentTermDom}
          </div>
          <div style={styles.slide}>
            {allTermDom}
          </div>
          <div style={styles.slide}>
            {tipsDom}
          </div>
        </SwipeableViews>


        <Dialog
          title={this.state.title}
          actions={actions}
          modal={true}
          open={this.state.open}
          onRequestClose={this.handleCloseDialog}
        >
        </Dialog>
      </div>

    );
  }
}


export default Main;
