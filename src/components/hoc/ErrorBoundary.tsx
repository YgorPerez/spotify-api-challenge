import { Component, type ErrorInfo, type ReactNode } from 'react'
import Header from '../ui/Header'

interface Props {
  children?: ReactNode
}

interface State {
  hasError: boolean
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  }

  public static getDerivedStateFromError(_: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo)
  }

  public render() {
    if (this.state.hasError) {
      return (
        <>
          <header>
            <Header />
          </header>
          <div>
            <h1>Oops, there was an error!</h1>
            <button
              type='button'
              onClick={() => this.setState({ hasError: false })}
            >
              Try again?
            </button>
          </div>
        </>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
