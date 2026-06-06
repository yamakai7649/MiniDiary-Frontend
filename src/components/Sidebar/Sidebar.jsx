import { useState,useEffect } from 'react';
import HomeIcon from '@mui/icons-material/Home';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import NotificationsIcon from '@mui/icons-material/Notifications';
import ListIcon from '@mui/icons-material/List';
import "./Sidebar.css";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import Menu from '../Menu/Menu';



export default function Sidebar() {
    const location = useLocation();
    const PUBLIC_FOLDER = process.env.REACT_APP_PUBLIC_FOLDER
    const [isMenuOpen, setMenuOpen] = useState(false);
    const user = useSelector((state) => {
        return state.AuthReducer.user;
    });
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const isActive = (path) => {
        if (path === '/') return location.pathname === '/';
        return location.pathname.startsWith(path);
    };

    if ( windowWidth <= 600 ) {
        return (
            <>
                <div className="BottombarContainer">
                    <div className="Bottombar">
                        <Link className={`BottombarLinkWrapper ${isActive('/') ? 'active' : ''}`} to="/" >
                            <div className="BottombarHome">
                                <HomeIcon className='BottombarHomeIcon'></HomeIcon>
                                <small className="BottombarHomeButton">ホーム</small>
                            </div>
                        </Link>
                        <Link className={`BottombarLinkWrapper ${isActive('/search') ? 'active' : ''}`} to="/search" >
                        <div className="BottombarSearch">
                            <PersonSearchIcon className='BottombarSearchIcon'></PersonSearchIcon>
                            <small className="BottombarSearchButton">検索</small>
                        </div>
                        </Link>
                        <Link className={`BottombarLinkWrapper ${isActive('/notification') ? 'active' : ''}`} to="/notification" >
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

    const isProfileActive = user?.username ? location.pathname.startsWith(`/profile/${user.username}`) : false;

    return (
        <>  
            
            <div className="SidebarContainer">
                <div className='Sidebar'>
                <Link className={`linkWrapper ${isProfileActive ? 'active' : ''}`} to={`/profile/${user?.username}`} >
                <div className="SidebarProfile">
                    <img className='SidebarProfileImg' alt="" src={user?.profilePicture ?
                   user?.profilePicture : PUBLIC_FOLDER + "person/noAvatar.png"
               } />
                            <span className="SidebarProfileButton">{user?.username}</span>                      
                </div>
                </Link>
                <Link className={`linkWrapper ${isActive('/') ? 'active' : ''}`} to="/" >
                <div className="SidebarHome">
                    <HomeIcon className='SidebarHomeIcon'></HomeIcon>
                    <span className="SidebarHomeButton">ホーム</span>
                </div>
                    </Link>  
                 <Link className={`linkWrapper ${isActive('/search') ? 'active' : ''}`} to="/search" >  
                <div className="SidebarSearch">
                    <PersonSearchIcon className='SidebarSearchIcon'></PersonSearchIcon>
                    <span className="SidebarSearchButton">検索</span>
                </div>
                        </Link> 
                <Link className={`linkWrapper ${isActive('/notification') ? 'active' : ''}`} to="/notification" >
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
