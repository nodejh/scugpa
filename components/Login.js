import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import TextField from 'material-ui/TextField';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import { Card, CardMedia } from 'material-ui/Card';
import AppBarIconMenu from './AppBarIconMenu';
import RefreshIndicatorLoading from './RefreshIndicator';

const URL_LOGIN = '/login';
const URL_WECHAT = 'http://mp.weixin.qq.com/s?__biz=MjM5NTA4Mjc4MA==&mid=200899913&idx=1&sn=6af2659f27bb52b536629bd1f76c4625#rd';
const styles = {
  loginContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: '50px'
  },
  textWidth: {
    width: '100%'
  },
  button: {
    marginTop: '30px',
    width: '100%'
  },
  loginText: {
    // width: '300px',
    // padding: '30px',
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
  },
  wechatTipsDialogContent: {
    width: '300px',
    height: '300px'
  },
};

class Login extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      open: false,
      openTips: false,
      openWechatTips: false,
      title: '',
      number: '',
      password: ''
    };
    this.onClickButton = this.onClickButton.bind(this);
    this.handleCloseDialog = this.handleCloseDialog.bind(this);
    this.handleOpenDialog = this.handleOpenDialog.bind(this);
    this.handleOpenWechatTips = this.handleOpenWechatTips.bind(this);
    this.handleCloseWechatTips = this.handleCloseWechatTips.bind(this);
    this.handleRedirectWechatTips = this.handleRedirectWechatTips.bind(this);
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


  /**
   * 打开 wechat tips dialog
   */

  handleOpenWechatTips() {
    this.setState({
      openWechatTips: true
    });
  }


  /**
   * 关闭 wechat tips dialog
   */
  handleCloseWechatTips() {
    this.setState({ openWechatTips: false });
  }


  /**
   *  wechat tips dialog 跳转到另一个页面
   */
  handleRedirectWechatTips() {
    window.location = URL_WECHAT;
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

    const actionsWechat = [
      <FlatButton
        label="确定"
        primary={true}
        onTouchTap={this.handleCloseWechatTips}
      />,
      <FlatButton
        label="关注飞扬微信"
        primary={true}
        onTouchTap={this.handleRedirectWechatTips}
      />,
    ];

    return (
      <div>
        <AppBarIconMenu />
        <div style={styles.loginContent} className='loginContent'>
          { this.state.isLoading && <RefreshIndicatorLoading initSize='30' initLeft='0' initTop='-15' initStatus='loading' /> }
          <div style={styles.loginText} className='loginText'>
            <h2>四川大学绩点平均分一键计算</h2>
            <TextField
              style={styles.textWidth}
              className='textWidth'
              hintText='请输入您的学号'
              floatingLabelText='请输入您的学号'
              autoComplete='off'
              type='number'
              onChange={(event, value) => this.setState({ number: value })}
              value={this.state.number}
            />
            <br/>
            <TextField
              style={styles.textWidth}
              className='textWidth'
              hintText='请输入您的密码'
              floatingLabelText='请输入您的密码'
              type='password'
              autoComplete='off'
              onChange={(event, value) => this.setState({ password: value })}
              value={this.state.password}
            />
            <br/>
            <RaisedButton
              primary={true}
              style={styles.button}
              className='button'
              label='计算绩点平均分'
              onTouchTap={this.onClickButton}
            />
            <div>
              <p style={styles.tips} onTouchTap={this.handleOpenWechatTips}>使用微信一键计算绩点?</p>
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

        <Dialog
          title="使用微信一键查看绩点"
          actions={actionsWechat}
          modal={false}
          open={this.state.openWechatTips}
          contentStyle={styles.wechatTipsDialogContent}
          onRequestClose={this.handleCloseWechatTips}
        >
          <Card>
            <CardMedia>
              <img src="/images/qrcode.jpg" />
            </CardMedia>
          </Card>
        </Dialog>
      </div>
    );
  }
}

export default Login;
