import React, { useEffect } from 'react'
import ReactDom from "react-dom"
import "./Delete.css";

export default function Delete({ handleDelete, setIsDeleting, comment,  }) {  
    useEffect(() => {
        document.body.style.overflow = "hidden";

        return () => {
            document.body.style.overflow = "";
        };
    }, []);

    return (
        ReactDom.createPortal(
            <>
                <div className="DeleteContainer">
                    <div className="DeleteDialog">
                        <small className="DeleteDialogTop">{comment ? "このコメントを削除しますか？":"この日記を削除しますか？"}</small>
                        <div className="DeleteDialogButtons">
                            <div onClick={() => setIsDeleting(false)} className='DeleteDialogLeftButton'><small>キャンセル</small></div>
                            <div onClick={handleDelete} className='DeleteDialogRightButton' ><small>はい</small></div>
                        </div>
                    </div>
                </div>
            </>
            ,
            document.getElementById("modal-root")
        )
    );
}
