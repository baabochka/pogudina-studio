import type { ErrorInfo, ReactNode } from "react";
import { Component } from "react";

import { ErrorFallback } from "../../pages/RouteErrorPage";

type AppErrorBoundaryProps = {
  children: ReactNode;
};

type AppErrorBoundaryState = {
  error: Error | null;
};

export class AppErrorBoundary extends Component<
  AppErrorBoundaryProps,
  AppErrorBoundaryState
> {
  state: AppErrorBoundaryState = {
    error: null,
  };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("AppErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.error) {
      return (
        <ErrorFallback
          title="Something went wrong"
          description={this.state.error.message || "An unexpected error occurred."}
        />
      );
    }

    return this.props.children;
  }
}
