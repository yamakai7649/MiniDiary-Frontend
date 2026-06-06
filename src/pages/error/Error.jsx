import React from 'react'
import { useLocation, useNavigate, Link } from "react-router-dom";
import "./Error.css";

export default function Error({ noPage }) {
    const location = useLocation();
    const navigate = useNavigate();

    if (noPage) {
        return (
            <div className="errorContainer">
                <span className='errorMessage'>404: ページが見つかりませんでした。</span>
                <Link to="/" className="errorButton">ホームに戻る</Link>
            </div>
        );
    }

    return (
        <div className="errorContainer">
            <span className='errorMessage'>{location.state?.message}</span>
            <button className="errorButton" onClick={() => navigate(-1)}>前のページに戻る</button>
        </div>
    );
}
