import React, { Component, ReactNode } from "react";
import { AlertCircle } from "lucide-react";

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  errorMessage: string;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    errorMessage: "",
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, errorMessage: error.message };
  }

  public componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="bg-red-50 border border-red-200 rounded-3xl p-6 flex flex-col items-center justify-center text-center space-y-4 min-h-[350px]">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center text-red-600 border border-red-200">
            <AlertCircle size={24} />
          </div>
          <div className="max-w-md space-y-1.5">
            <h4 className="text-sm font-bold text-gray-800">Map Initialization Failed</h4>
            <p className="text-xs text-gray-500 leading-relaxed">
              Google Maps failed to load. Please check your API key configuration.
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
