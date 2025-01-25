import React from 'react'
import { useLocation} from "react-router-dom";
import "./Error.css";

export default function Error({noPage}) {
    const location = useLocation();
    if (noPage) {
        return (
            <div className="errorContainer">
                <span className='errorMessage'>404: ページが見つかりませんでした。</span>
            </div>
        );
    } else {
        return (
        <div className="errorContainer">
            <span className='errorMessage'>{location.state.message}</span>
        </div>
    );
    }
}
