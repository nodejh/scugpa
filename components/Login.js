import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import TextField from 'material-ui/TextField';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import AppBarIconMenu from './AppBarIconMenu';
import RefreshIndicatorLoading from './RefreshIndicator';


const URL_LOGIN = '/login';
const styles = {
  loginContent: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: '50px'
  },
  textWidth: {
    width: '300px'
  },
  button: {
    width: '300px',
    marginTop: '30px'
  },
  loginText: {
    width: '300px',
    padding: '30px',
    backgroundColor: '#fff',
    boxShadow: 'rgba(0, 0, 0, 0.156863) 0px 3px 10px, rgba(0, 0, 0, 0.227451) 0px 3px 10px'
  },
  tips: {
    cursor: 'pointer',
    marginTop: '20px',
    color: '#BDBDBD'
  },
  refresh: {
    display: 'inline-block',
    position: 'relative',
  }
};

class Login extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      open: false,
      title: '',
      number: '',
      password: ''
    };
    this.onClickButton = this.onClickButton.bind(this);
    this.handleCloseDialog = this.handleCloseDialog.bind(this);
    this.handleOpenDialog = this.handleOpenDialog.bind(this);
  }


  /**
   * 模拟登陆
   */
  onClickButton() {
    this.setState({
      isLoading: true
    });
    const number = this.state.number;
    const password = this.state.password;
    fetch(URL_LOGIN, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        number: number,
        password: password
      })
    })
    .then((response) => response.json())
    .then((responseJson) => {
      console.log('fetch responseJson: ', responseJson);
      this.setState({
        isLoading: false,
      });
      if (responseJson.code === 0) {
        // 跳转到首页
        browserHistory.push('/');
      } else {
        this.handleOpenDialog(responseJson.error);
      }
    })
    .catch((error) => {
      console.error(error);
      this.setState({
        isLoading: false
      });
    });
  }


  /**
   * 关闭 Dialog
   */
  handleCloseDialog() {
    this.setState({ open: false });
  }


  /**
   * 打开 Dialog
   */
  handleOpenDialog(title) {
    this.setState({
      title: title,
      open: true
    });
  }


  render() {
    // console.log('this state: ', this.state);
    const actions = [
      <FlatButton
        label='确定'
        primary={true}
        onTouchTap={this.handleCloseDialog}
      />
    ];

    return (
      <div>
        <AppBarIconMenu />
        <div style={styles.loginContent}>
          { this.state.isLoading && <RefreshIndicatorLoading initSize='30' initLeft='0' initTop='-15' initStatus='loading' /> }
          <div style={styles.loginText}>
            <h2>四川大学绩点平均分一键计算</h2>
            <TextField
              style={styles.textWidth}
              hintText='请输入您的学号'
              floatingLabelText='请输入您的学号'
              autoComplete='off'
              type='number'
              onChange={(event, value) => this.setState({ number: value })}
              value={this.state.number}
            />
            <TextField
              style={styles.textWidth}
              hintText='请输入您的密码'
              floatingLabelText='请输入您的密码'
              type='password'
              autoComplete='off'
              onChange={(event, value) => this.setState({ password: value })}
              value={this.state.password}
            />
            <RaisedButton
              primary={true}
              style={styles.button}
              label='计算绩点平均分'
              onClick={this.onClickButton}
            />
            <div>
              <p style={styles.tips}>使用微信一键计算绩点?</p>
            </div>
          </div>
        </div>
        <footer>
          <a target='_blank' href='http://fyscu.com'>@飞扬俱乐部</a>·「<a target='_blank' href='http://lab.fyscu.com'>研发实验室</a>」出品
        </footer>
        <Dialog
          title={this.state.title}
          actions={actions}
          modal={false}
          open={this.state.open}
          onRequestClose={this.handleCloseDialog}
        >
        </Dialog>
      </div>
    );
  }
}

export default Login;
