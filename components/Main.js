import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import { Tabs, Tab } from 'material-ui/Tabs';
import SwipeableViews from 'react-swipeable-views';
import AppBarIconMenu from './AppBarIconMenu';
import RefreshIndicatorLoading from './RefreshIndicator';
import CurrentTerm from './CurrentTerm';
import Test from './Test';
import CaculateGrade from './CaculateGrade';

const URL_GET_GRADE = '/grade';


const styles = {
  loading: {
    display: 'flex',
    justifyContent: 'center'
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
      selectedRowsData: []
    };
    this.getGrade = this.getGrade.bind(this);
    this.handleOpenDialog = this.handleOpenDialog.bind(this);
    this.handleCloseDialog = this.handleCloseDialog.bind(this);
    this.handleChangeTab = this.handleChangeTab.bind(this);
    this.getSelectedRowsData = this.getSelectedRowsData.bind(this);
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
   */
  getSelectedRowsData(grade) {
    console.log('main Page getSelectedRowsData...');
    console.log(grade);
    this.setState({
      selectedRowsData: grade
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
    // let allGradeDom = ''; // 所有成绩(及格+不及格)
    // let tipsDom = ''; // 使用前必读
    if (this.state.data) {
      currentTermDom = (
        <CurrentTerm
          currentTerm={this.state.data.currentTerm}
          getSelectedRowsData={this.getSelectedRowsData} />
      );
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
            <Test />
          </div>
          <div style={styles.slide}>
            slide n°3
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
