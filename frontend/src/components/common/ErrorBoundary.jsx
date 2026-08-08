import { Component, createRef } from 'react';
import { AlertTriangle } from 'lucide-react';
import PropTypes from 'prop-types';

/**
 * ErrorBoundary Component
 *
 * A comprehensive error boundary that intercepts React rendering errors
 * with advanced features:
 *  - Detailed error reporting with stack traces
 *  - Custom fallback UI support
 *  - Error recovery with retry mechanism
 *  - Error event logging and analytics support
 *  - Development vs production error details
 *  - Keyboard accessibility
 *  - Memory leak prevention
 */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: 0,
    };
    this.resetRef = createRef();
    this.mounted = false;
  }

  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidMount() {
    this.mounted = true;
  }

  componentWillUnmount() {
    this.mounted = false;
    // Clean up any lingering error states
    this.resetErrorState();
  }

  componentDidCatch(error, errorInfo) {
    const { onError, onErrorInfo } = this.props;

    // Log error with component stack
    const errorDetails = {
      error: error.toString(),
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      retryCount: this.state.retryCount,
    };

    // Console logging with development/production distinction
    if (process.env.NODE_ENV === 'development') {
      console.group('🚨 ErrorBoundary Caught an Error');
      console.error('Error:', error);
      console.error('Component Stack:', errorInfo.componentStack);
      console.error('Full Error Details:', errorDetails);
      console.groupEnd();
    } else {
      // Production logging
      console.error('Application Error:', error.message);
    }

    // Custom error handlers
    if (onError) {
      onError(error, errorInfo);
    }

    if (onErrorInfo) {
      onErrorInfo(errorDetails);
    }

    // Update state with error info for display
    this.setState({
      errorInfo,
    });
  }

  resetErrorState = () => {
    if (this.mounted) {
      this.setState({
        hasError: false,
        error: null,
        errorInfo: null,
        retryCount: 0,
      });
    }
  };

  handleReset = () => {
    const { onReset, resetKey } = this.props;

    this.setState((prevState) => ({
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: prevState.retryCount + 1,
    }));

    // Call custom reset handler
    if (onReset) {
      onReset();
    }

    // Reset key-based recovery
    if (resetKey) {
      // Force re-render of children by changing key
      this.forceUpdate();
    }
  };

  handleRetry = () => {
    this.handleReset();
  };

  handleRefresh = () => {
    if (this.props.onRefresh) {
      this.props.onRefresh();
    } else {
      window.location.reload();
    }
  };

  getErrorMessage = () => {
    const { error } = this.state;
    if (!error) return null;

    // Development: show full error details
    if (process.env.NODE_ENV === 'development') {
      return error.toString();
    }

    // Production: show user-friendly message
    return error.message || 'An unexpected error occurred';
  };

  renderFallback = () => {
    const { fallback, fallbackProps } = this.props;
    const { error, errorInfo, retryCount } = this.state;

    // Use custom fallback if provided
    if (fallback) {
      return typeof fallback === 'function'
        ? fallback({
            error,
            errorInfo,
            retryCount,
            resetError: this.handleReset,
            retry: this.handleRetry,
            ...fallbackProps,
          })
        : fallback;
    }

    return this.renderDefaultFallback();
  };

  renderDefaultFallback = () => {
    const { error, retryCount } = this.state;
    const { showStackTrace, maxRetries, variant, title, message } = this.props;

    const isRetryable = retryCount < (maxRetries ?? 3);
    const errorMessage = this.getErrorMessage();

    // Variant-specific styling
    const variants = {
      default: {
        border: 'border-red-200 dark:border-red-800',
        bg: 'bg-red-50 dark:bg-red-900/20',
        icon: 'text-red-600 dark:text-red-400',
        iconBg: 'bg-red-100 dark:bg-red-900/30',
        button:
          'bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600',
      },
      warning: {
        border: 'border-yellow-200 dark:border-yellow-800',
        bg: 'bg-yellow-50 dark:bg-yellow-900/20',
        icon: 'text-yellow-600 dark:text-yellow-400',
        iconBg: 'bg-yellow-100 dark:bg-yellow-900/30',
        button:
          'bg-yellow-600 hover:bg-yellow-700 dark:bg-yellow-500 dark:hover:bg-yellow-600',
      },
      critical: {
        border: 'border-red-600 dark:border-red-400',
        bg: 'bg-red-100 dark:bg-red-900/40',
        icon: 'text-red-700 dark:text-red-300',
        iconBg: 'bg-red-200 dark:bg-red-800/50',
        button:
          'bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600',
      },
    };

    const styleVariant = variants[variant] || variants.default;

    return (
      <div
        className={`m-4 flex min-h-[50vh] flex-col items-center justify-center rounded-2xl border ${styleVariant.border} ${styleVariant.bg} p-8 transition-all duration-300`}
        role='alert'
        aria-live='assertive'
        aria-labelledby='error-title'
      >
        <div className='max-w-lg w-full text-center'>
          {/* Icon */}
          <div
            className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full ${styleVariant.iconBg}`}
          >
            <AlertTriangle className={`h-8 w-8 ${styleVariant.icon}`} />
          </div>

          {/* Title */}
          <h2
            id='error-title'
            className='mb-2 text-2xl font-semibold text-gray-900 dark:text-white'
          >
            {title || 'Something went wrong'}
          </h2>

          {/* Message */}
          <p className='mb-4 text-gray-600 dark:text-gray-400'>
            {message ||
              'We are sorry for the inconvenience. Please try the following options:'}
          </p>

          {/* Error details (development only or opt-in) */}
          {showStackTrace && errorMessage && (
            <div className='mb-4 rounded-lg bg-gray-900/10 p-4 text-left dark:bg-gray-900/30'>
              <p className='mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300'>
                Error Details:
              </p>
              <pre className='overflow-auto text-xs text-gray-600 dark:text-gray-400 max-h-32 whitespace-pre-wrap break-words'>
                {errorMessage}
                {this.state.errorInfo?.componentStack && (
                  <>
                    {'\n\n'}
                    {this.state.errorInfo.componentStack}
                  </>
                )}
              </pre>
              {retryCount > 0 && (
                <p className='mt-2 text-xs text-gray-500 dark:text-gray-500 dark:text-gray-400'>
                  Retry attempt: {retryCount}
                </p>
              )}
            </div>
          )}

          {/* Action buttons */}
          <div className='flex flex-col sm:flex-row gap-3 justify-center'>
            {isRetryable && (
              <button
                onClick={this.handleRetry}
                className={`rounded-lg ${styleVariant.button} px-6 py-2.5 font-medium text-white shadow-md transition-all duration-200 hover:shadow-lg focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-900`}
                aria-label='Try again'
              >
                {this.props.retryLabel || 'Try Again'}
              </button>
            )}

            <button
              onClick={this.handleRefresh}
              className='rounded-lg bg-gray-200 dark:bg-gray-700 px-6 py-2.5 font-medium text-gray-700 dark:text-gray-200 shadow-md transition-all duration-200 hover:bg-gray-300 hover:shadow-lg   dark:hover:bg-gray-600 focus:ring-2 focus:ring-offset-2 focus:ring-gray-500'
              aria-label='Refresh page'
            >
              {this.props.refreshLabel || 'Refresh Page'}
            </button>

            {this.props.showResetButton && (
              <button
                onClick={this.resetErrorState}
                className='rounded-lg border border-gray-300 px-6 py-2.5 font-medium text-gray-600 dark:text-gray-300 transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-700 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-800'
                aria-label='Reset error state'
              >
                {this.props.resetLabel || 'Dismiss'}
              </button>
            )}
          </div>

          {/* Support message */}
          {this.props.showSupportLink && (
            <p className='mt-4 text-sm text-gray-500 dark:text-gray-500 dark:text-gray-400'>
              If the problem persists, please{' '}
              <a
                href={this.props.supportLink || '#'}
                className='text-blue-600 hover:underline dark:text-blue-400'
                target='_blank'
                rel='noopener noreferrer'
              >
                contact support
              </a>
            </p>
          )}
        </div>
      </div>
    );
  };

  render() {
    const { hasError } = this.state;
    const { children, fallback } = this.props;

    if (hasError) {
      return this.renderFallback();
    }

    return children;
  }
}

ErrorBoundary.propTypes = {
  // Children to be rendered and protected
  children: PropTypes.node.isRequired,

  // Custom fallback UI (component or render function)
  fallback: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),

  // Props to pass to the fallback render function
  fallbackProps: PropTypes.object,

  // Error handlers
  onError: PropTypes.func,
  onErrorInfo: PropTypes.func,
  onReset: PropTypes.func,
  onRefresh: PropTypes.func,

  // Reset configuration
  resetKey: PropTypes.string,
  maxRetries: PropTypes.number,

  // UI customization
  variant: PropTypes.oneOf(['default', 'warning', 'critical']),
  title: PropTypes.string,
  message: PropTypes.string,
  retryLabel: PropTypes.string,
  refreshLabel: PropTypes.string,
  resetLabel: PropTypes.string,

  // Feature flags
  showStackTrace: PropTypes.bool,
  showResetButton: PropTypes.bool,
  showSupportLink: PropTypes.bool,
  supportLink: PropTypes.string,
};

ErrorBoundary.defaultProps = {
  fallback: null,
  fallbackProps: {},
  onError: null,
  onErrorInfo: null,
  onReset: null,
  onRefresh: null,
  resetKey: null,
  maxRetries: 3,
  variant: 'default',
  title: null,
  message: null,
  retryLabel: 'Try Again',
  refreshLabel: 'Refresh Page',
  resetLabel: 'Dismiss',
  showStackTrace: false,
  showResetButton: false,
  showSupportLink: false,
  supportLink: '#',
};

ErrorBoundary.displayName = 'ErrorBoundary';

export default ErrorBoundary;
