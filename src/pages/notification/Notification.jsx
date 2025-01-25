import React, { useEffect,useState } from 'react'
import axios from "axios";
import Sidebar from "../../components/Sidebar/Sidebar";
import Spinner from "../../components/Spinner/Spinner";
import { useSelector } from 'react-redux';
import { format } from "timeago.js";
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import CommentIcon from '@mui/icons-material/Comment';
import GroupIcon from '@mui/icons-material/Group';
import "./Notification.css";
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';

export default function Notification() { 
    const PUBLIC_FOLDER = process.env.REACT_APP_PUBLIC_FOLDER
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [notifications, setNotifications] = useState();
    const [requests, setRequests] = useState();
    const [activeTab, setActiveTab] = useState("notification");
    const user = useSelector((state) => {
        return state.AuthReducer.user;
    });
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    useEffect(() => {
        window.addEventListener("resize", () => setWindowWidth(window.innerWidth));

        return () => {
          window.removeEventListener("resize", () => setWindowWidth(window.innerWidth));  
        }
    }, []);

    const fetchNotifications = async () => {
        if (user) {
            const res = await axios.get(`/notification?userId=${user?._id}`);
            const notifications = res.data.filter((data) => data.type === "like" || data.type === "comment");
            const requests = res.data.filter((data) => data.type === "follow");
            setNotifications(notifications);
            setRequests(requests);
            return;
        }
    }
    
    useEffect(() => {
        try {
            fetchNotifications();
        } catch (err) {
            console.log(err);
            navigate("/error", { state: { message: "データの取得に失敗しました。後ほど再試行してください。" } });
        } finally {
            setTimeout(() => {
                setIsLoading(false);
            },500);
        }
    }, [user?._id]);

    const handleDelete = async (id) => {
        try {
            await axios.delete(`/notification?notificationId=${id}`);
            fetchNotifications();
        } catch (err) {
            console.log(err);
            navigate("/error", { state: { message: "予期しないエラーが発生しました。もう一度お試しください。" } });
        }
    }

    return (
        <>
            <div className="NotificationContainer">
                <Sidebar></Sidebar>
                <div className="Notifications">
                    {windowWidth <= 600 ?
                        <div className="NotificationTop">
                            <Link className='linkWrapper' to={`/profile/${user?.username}`} style={{ textDecoration: "none", color: "black" }}>
                                <img className='TopbarProfile' src={user?.profilePicture ?
                                    PUBLIC_FOLDER + user?.profilePicture : PUBLIC_FOLDER + "/person/noAvatar.png"
                                } />
                            </Link>
                            <h2 className="NotificationTitle">通知</h2>
                            <div className="NotificationSwitch">
                                <div onClick={() => setActiveTab("notification")} className={activeTab === "notification" ? "NotificationButtonActive" : "NotificationButton"}>通知</div>
                                <div onClick={() => setActiveTab("request")} className={activeTab === "request" ? "RequestButtonActive" : "RequestButton"}>リクエスト</div>
                            </div>
                        </div>
                        :
                        <div className="NotificationTop">
                            <h2 className="NotificationTitle">通知</h2>
                            <div className="NotificationSwitch">
                                <div onClick={() => setActiveTab("notification")} className={activeTab === "notification" ? "NotificationButtonActive" : "NotificationButton"}>通知</div>
                                <div onClick={() => setActiveTab("request")} className={activeTab === "request" ? "RequestButtonActive" : "RequestButton"}>リクエスト</div>
                            </div>
                        </div>
                    }
                    <div className="NotificationContainer2">
                        {isLoading ? <div className="NotificationSpinner"><Spinner></Spinner></div> :
                        activeTab === "notification" ?
                        notifications && notifications.length ? notifications
                            .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
                            .map((notification) => {
                                return (
                                    <Link className='NotificationLinkWrapper' to={`/comment/${notification.postId}`}>
                                        <div onClick={() => handleDelete(notification._id)} className="Notification" key={notification._id}>
                                            <div className="NotificationIcon">{notification.type === "like" ? <ThumbUpAltIcon></ThumbUpAltIcon> : <CommentIcon></CommentIcon>}</div>
                                            <div className="NotificationContent">
                                                <div className="NotificationContentContent">{notification.content}</div>
                                                <small className="NotificationContentTime">{format(notification.createdAt)}</small>
                                            </div>
                                        </div>
                                    </Link>
                                )
                            }) : <h2 className='noNotification'>通知はありません</h2> :
                        requests && requests.length ? requests
                            .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
                            .map((request) => {
                                return (
                                    <Link className='NotificationLinkWrapper' to={`/profile/${request.usernameOfFollower}`}>
                                        <div onClick={() => handleDelete(request._id)} className="Notification" key={request._id}>
                                            <div className="NotificationIcon"><GroupIcon></GroupIcon></div>
                                            <div className="NotificationContent">
                                                <div className="NotificationContentContent">{request.content}</div>
                                                <small className="NotificationContentTime">{format(request.createdAt)}</small>
                                            </div>
                                        </div>
                                    </Link>
                                )
                            }) : <h2 className='noNotification'>フォローリクエストはありません</h2>}
                    </div>
                </div>
            </div>
        </>
    );
};
