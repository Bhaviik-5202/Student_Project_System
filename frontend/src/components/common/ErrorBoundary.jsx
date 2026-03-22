import { Component } from 'react';

/**
 * ErrorBoundary Component
 *
 * A catch-all security and stability component that intercepts React
 * rendering errors. Provides a user-friendly fallback UI and allows
 * for application recovery via controlled state resets.
 */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Application Error Boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className='m-4 flex min-h-[50vh] flex-col items-center justify-center rounded-2xl bg-gray-50 p-8 transition-colors duration-300 dark:bg-gray-900/50'>
          <div className='max-w-md text-center'>
            <div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30'>
              <svg
                className='h-8 w-8 text-red-600 dark:text-red-400'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'
                />
              </svg>
            </div>
            <h2 className='mb-2 text-xl font-semibold text-gray-900 dark:text-white'>
              Something went wrong
            </h2>
            <p className='mb-6 text-gray-600 dark:text-gray-400'>
              We are sorry for the inconvenience. Please try refreshing the
              page.
            </p>
            <button
              onClick={() => window.location.reload()}
              className='rounded-lg bg-blue-600 px-6 py-2.5 font-medium text-white shadow-md transition-colors duration-200 hover:bg-blue-700 hover:shadow-lg dark:bg-blue-500 dark:hover:bg-blue-600'
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
