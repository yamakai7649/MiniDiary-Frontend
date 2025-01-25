import React from "react";

export class ErrorBoundary extends React.Component{
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(err) {
        return { hasError: true };
    }

    render() {
    if (this.state.hasError) {
        return (
            <div> className="errorContainer"
                <span className='errorMessage'>予期しないエラーが発生しました。もう一度お試しください。</span>
            </div>
        );
    }
        return this.props.children; 
  }
}



