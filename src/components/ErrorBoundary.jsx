import { Component } from "react";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen w-full bg-black text-white flex items-center justify-center p-6">
          <div className="max-w-md text-center space-y-4">
            <div className="w-12 h-12 mx-auto border border-white/20 flex items-center justify-center">
              <span className="text-lg font-bold text-white/40">!</span>
            </div>
            <h2 className="text-xl font-bold">Something went wrong</h2>
            <p className="text-sm text-white/50">We encountered an unexpected error. Please refresh the page or try again later.</p>
            <button
              onClick={() => window.location.reload()}
              className="px-5 py-2 bg-white text-black text-sm font-medium hover:bg-white/90 transition-colors"
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
