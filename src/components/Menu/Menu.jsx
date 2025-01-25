import {useEffect, useState} from 'react'
import ReactDOM from "react-dom"
import "./Menu.css"
import Logout from '../Logout/Logout';
import { logoutCall } from '../../actionCalls';
import { useDispatch,useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom';
import Delete from '../Delete/Delete';

export default function Menu({ setMenuOpen }) {
    const [isLoggingout, setLoggingout] = useState(false);
    
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        document.body.style.overflow = "hidden";

        return () => {
            document.body.style.overflow = "";
        };
    }, []);


    const handleLogout = async() => {
        try {
            await logoutCall(dispatch);
            setMenuOpen(false);
            setLoggingout(false);
            navigate("/home");
        } catch (err) {
            console.log(err);
            navigate("/error", { state: { message: "予期しないエラーが発生しました。もう一度お試しください。" }});
        }
    }


    return (
        ReactDOM.createPortal(
            <>
                <div className="MenuOverlay" onClick={()=> setMenuOpen(false)}>
                    <div className="MenuContainer" onClick={(e) => e.stopPropagation()}>
                        <div className="MenuLogout" onClick={() => setLoggingout(true)}><span>ログアウト</span></div>
                    </div>
                </div>
                {isLoggingout && <Logout handleLogout={handleLogout} setLoggingout={setLoggingout}></Logout>} 
            </>
            ,
            document.getElementById("modal-root"))
    );
}
