import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle } from "lucide-react";

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
}

class MapErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Map error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="w-full h-full flex items-center justify-center bg-secondary/10 rounded-md">
          <div className="flex flex-col items-center p-4 text-center">
            <AlertTriangle className="h-12 w-12 text-destructive mb-2" />
            <h3 className="text-lg font-medium">Map Failed to Load</h3>
            <p className="text-sm text-muted-foreground">
              There was an issue loading the map. Please try reloading the page. If the error persists, report it to the
              issue tracker.
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default MapErrorBoundary;
