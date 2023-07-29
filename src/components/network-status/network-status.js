import React from 'react';

export default class NetworkStatus extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      online: true,
    };

    this.goOnline = this.goOnline.bind(this);
    this.goOffline = this.goOffline.bind(this);
  }

  componentDidMount() {
    this.setState({
      online: typeof navigator.onLine === 'boolean' ? navigator.onLine : true,
    });

    window.addEventListener('online', this.goOnline);
    window.addEventListener('offline', this.goOffline);
  }

  componentWillUnmount() {
    window.removeEventListener('online', this.goOnline);
    window.removeEventListener('offline', this.goOffline);
  }

  goOnline() {
    this.setState({ online: true });
  }

  goOffline() {
    this.setState({ online: false });
  }

  render() {
    // eslint-disable-next-line react/destructuring-assignment
    return this.props.children(this.state);
  }
}
