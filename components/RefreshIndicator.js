import React, { Component } from 'react';
import RefreshIndicator from 'material-ui/RefreshIndicator';

const style = {
  container: {
    position: 'absolute',
    width: '100%',
    textAlign: 'center'
  },
  refresh: {
    display: 'inline-block',
    position: 'relative',
    margin: '0 auto'
  },
};


class RefreshIndicatorLoading extends Component {
  constructor(props) {
    super(props);
    this.state = {
      size: parseInt(this.props.initSize, 0),
      left: parseInt(this.props.initLeft, 0),
      top: parseInt(this.props.initTop, 0),
      status: this.props.initStatus
    };
  }

  render() {
    return (
      <div style={style.container}>
        <RefreshIndicator
          size={this.state.size}
          left={this.state.left}
          top={this.state.top}
          status={this.state.status}
          style={style.refresh}
        />
      </div>
    );
  }
}


export default RefreshIndicatorLoading;
