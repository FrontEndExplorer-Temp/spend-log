import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // You can log error info to an error reporting service here
    // console.error(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="max-w-lg mx-auto mt-12 p-8 bg-white dark:bg-gray-800 rounded-xl shadow text-center">
          <h2 className="text-2xl font-bold mb-4 text-red-600 dark:text-red-400">Something went wrong.</h2>
          <p className="mb-2 text-gray-700 dark:text-gray-200">An unexpected error occurred. Please try refreshing the page.</p>
          <details className="text-xs text-gray-500 dark:text-gray-400" style={{ whiteSpace: 'pre-wrap' }}>
            {this.state.error && this.state.error.toString()}
          </details>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary; 