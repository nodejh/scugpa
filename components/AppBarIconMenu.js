import React, { Component } from 'react';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import Tips from './Tips';


class AppBarIconMenu extends Component {

  constructor(props) {
    super(props);
    this.state = {
      openTips: false
    };
    this.handleCloseTips = this.handleCloseTips.bind(this);
    this.handleOpenTips = this.handleOpenTips.bind(this);
  }

  /**
   * 关闭 tips dialog
   */
  handleCloseTips() {
    this.setState({ openTips: false });
  }


  /**
  * 打开 tips dialog
  */
  handleOpenTips() {
    this.setState({ openTips: true });
  }


  render() {
    const actionTips = [
      <FlatButton
        label='确定'
        primary={true}
        onTouchTap={this.handleCloseTips}
      />
    ];

    return (
      <div>
        <AppBar
          title="四川大学绩点平均分一键计算"
          iconElementLeft={<span></span>}
          iconElementRight={
            <IconMenu
              iconButtonElement={
                <IconButton><MoreVertIcon /></IconButton>
              }
              targetOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
            >
              <MenuItem primaryText="使用必读" onTouchTap={this.handleOpenTips} />
              <MenuItem primaryText="查看源码" href="https://github.com/nodejh/scugpa" />
              <MenuItem primaryText="BUG反馈" href="https://github.com/nodejh/scugpa/issues" />
              <MenuItem primaryText="关于作者" href="http://nodejh.com/about/" />
              <MenuItem primaryText="退出登陆" href="/logout" />
            </IconMenu>
          }
        />

        <Dialog
          title={`使用必读`}
          actions={actionTips}
          modal={false}
          open={this.state.openTips}
          onRequestClose={this.handleCloseTips}
          autoScrollBodyContent={true}
        >
          <Tips />
        </Dialog>
      </div>
    );
  }
}


export default AppBarIconMenu;
