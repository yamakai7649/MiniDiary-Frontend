import { useState,useEffect } from 'react';
import HomeIcon from '@mui/icons-material/Home';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import NotificationsIcon from '@mui/icons-material/Notifications';
import ListIcon from '@mui/icons-material/List';
import "./Sidebar.css";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import Menu from '../Menu/Menu';



export default function Sidebar() {
    const PUBLIC_FOLDER = process.env.REACT_APP_PUBLIC_FOLDER
    const [isMenuOpen, setMenuOpen] = useState(false);
    const user = useSelector((state) => {
        return state.AuthReducer.user;
    });
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    useEffect(() => {
        window.addEventListener("resize", () => setWindowWidth(window.innerWidth));

        return () => {
            window.removeEventListener("resize", () => setWindowWidth(window.innerWidth));
        };
    }, []);

    if ( windowWidth <= 600 ) {
        return (
            <>
                <div className="BottombarContainer">
                    <div className="Bottombar">
                        <Link className='BottombarLinkWrapper' to="/" style={{ textDecoration: "none", color: "black" }}>
                            <div className="BottombarHome">
                                <HomeIcon className='BottombarHomeIcon'></HomeIcon>
                                <small className="BottombarHomeButton">ホーム</small>
                            </div>
                        </Link>
                        <Link className='BottombarLinkWrapper' to="/search" style={{ textDecoration: "none", color: "black" }}>
                        <div className="BottombarSearch">
                            <PersonSearchIcon className='BottombarSearchIcon'></PersonSearchIcon>
                            <small className="BottombarSearchButton">検索</small>
                        </div>
                        </Link>
                        <Link className='BottombarLinkWrapper' to="/notification" style={{ textDecoration: "none", color: "black" }}>
                            <div className="BottombarNotice">
                                <NotificationsIcon className='BottombarNoticeIcon'></NotificationsIcon>
                                <small className="BottombarNoticeButton">通知</small>
                            </div>
                        </Link>
                        <div className="BottombarSettings" onClick={() => setMenuOpen(true)}>
                            <ListIcon className='BottombarSettingsIcon'></ListIcon>
                            <small className="BottombarSettingsButton">メニュー</small>
                        </div>
                    </div>
                </div>
                {isMenuOpen && <Menu setMenuOpen={setMenuOpen}></Menu>}
            </>
        );
    }

    return (
        <>  
            
            <div className="SidebarContainer">
                <div className='Sidebar'>
                <Link className='linkWrapper' to={`/profile/${user?.username}`} style={{ textDecoration: "none", color: "black" }}>
                <div className="SidebarProfile">
                    <img className='SidebarProfileImg' src={user?.profilePicture ?
                  PUBLIC_FOLDER + user?.profilePicture : PUBLIC_FOLDER + "/person/noAvatar.png"
              } />
                            <span className="SidebarProfileButton">{user?.username}</span>                      
                </div>
                </Link>
                <Link className='linkWrapper' to="/" style={{ textDecoration: "none", color: "black" }}>
                <div className="SidebarHome">
                    <HomeIcon className='SidebarHomeIcon'></HomeIcon>
                    <span className="SidebarHomeButton">ホーム</span>
                </div>
                    </Link>  
                 <Link className='BottombarLinkWrapper' to="/search" style={{ textDecoration: "none", color: "black" }}>  
                <div className="SidebarSearch">
                    <PersonSearchIcon className='SidebarSearchIcon'></PersonSearchIcon>
                    <span className="SidebarSearchButton">ユーザーを検索</span>
                        </div>
                        </Link> 
                <Link className='linkWrapper' to="/notification" style={{ textDecoration: "none", color: "black" }}>
                <div className="SidebarNotice">
                    <NotificationsIcon className='SidebarNoticeIcon'></NotificationsIcon>
                    <span className="SidebarNoticeButton">通知</span>
                </div>
                </Link>
                <div className="SidebarSettings" onClick={() => setMenuOpen(true)}>
                    <ListIcon className='SidebarSettingsIcon'></ListIcon>
                        <span className="SidebarSettingsButton">メニュー</span>
                </div>  
            </div>
            
            </div>

            {isMenuOpen && <Menu setMenuOpen={setMenuOpen}></Menu>}
            
      </>     
  )
}
