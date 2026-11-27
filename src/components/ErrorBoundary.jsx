import { Component } from 'react';
import Alert from './Alert.jsx';

export default class ErrorBoundary extends Component {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    if (this.state.failed) {
      return (
        <div className="boot">
          <Alert message="This page could not be shown." onRetry={() => this.setState({ failed: false })} />
        </div>
      );
    }
    return this.props.children;
  }
}
