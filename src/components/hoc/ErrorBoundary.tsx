import { Button } from '@components/ui/Button';
import { log } from 'next-axiom';
import Link from 'next/link';
import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(_: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
    log.error(`Uncaught error: ${String(error)}, ${String(errorInfo)}`);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className='min-h-full bg-white px-4 py-16 sm:px-6 sm:py-24 md:grid md:place-items-center lg:px-8'>
          <div className='mx-auto max-w-max'>
            <main className='sm:flex'>
              <div className='sm:ml-6'>
                <div className='sm:border-l sm:border-gray-200 sm:pl-6'>
                  <h1 className='text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl'>
                    An error ocurred
                  </h1>
                </div>
                <div className='mt-10 flex space-x-3 sm:border-l sm:border-transparent sm:pl-6'>
                  <Button
                    className='inline-flex items-center rounded-md  border-transparent  bg-gradient-to-br from-pink-400 to-cyan-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-gradient-to-br hover:from-pink-600 hover:to-cyan-800 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2'
                    onClick={() => this.setState({ hasError: false })}
                  >
                    Try again?
                  </Button>
                  <Link
                    href='/'
                    className='inline-flex items-center rounded-md  border-transparent  bg-gradient-to-br from-pink-400 to-cyan-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-gradient-to-br hover:from-pink-600 hover:to-cyan-800 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2'
                  >
                    Go back home
                  </Link>
                </div>
              </div>
            </main>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
