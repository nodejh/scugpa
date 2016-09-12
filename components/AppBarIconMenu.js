import React from 'react';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';


const AppBarIconMenu = () => (
  <AppBar
    title="四川大学绩点平均分一键计算"
    iconElementRight={
      <IconMenu
        iconButtonElement={
          <IconButton><MoreVertIcon /></IconButton>
        }
        targetOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
      >
        <MenuItem primaryText="查看源码" href="https://github.com/nodejh/scugpa" />
        <MenuItem primaryText="BUG反馈" href="https://github.com/nodejh/scugpa/issues" />
        <MenuItem primaryText="关于作者" href="http://nodejh.com/about/" />
        <MenuItem primaryText="退出登陆" href="/logout" />
      </IconMenu>
    }
  />
);

export default AppBarIconMenu;
