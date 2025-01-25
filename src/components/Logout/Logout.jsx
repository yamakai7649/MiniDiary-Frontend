import {useEffect} from 'react'
import ReactDom from "react-dom"
import "./Logout.css"

export default function Logout({handleLogout,setLoggingout}) {
  useEffect(() => {
        document.body.style.overflow = "hidden";

        return () => {
            document.body.style.overflow = "";
        };
    }, []);

    return (
        ReactDom.createPortal(
            <>
                <div className="LogoutContainer">
                    <div className="LogoutDialog">
                        <small className="LogoutDialogTop">ログアウトしますか？</small>
                        <div className="LogoutDialogButtons">
                            <div onClick={()=> setLoggingout(false)} className='LogoutDialogLeftButton'><small>キャンセル</small></div>
                            <div onClick={handleLogout} className='LogoutDialogRightButton' ><small>はい</small></div>
                        </div>
                    </div>
                </div>
            </>
            ,
            document.getElementById("modal-root")
        )
    );
}
