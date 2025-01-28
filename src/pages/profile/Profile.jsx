import {useState,useEffect} from 'react';
import Sidebar from "../../components/Sidebar/Sidebar";
import Timeline from "../../components/Timeline/Timeline";
import "./Profile.css";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useSelector,useDispatch } from "react-redux";
import { followCall, unfollowCall } from '../../actionCalls';
import { useNavigate } from 'react-router-dom';
import EditProfile from '../../components/EditProfile/EditProfile';
import Spinner from '../../components/Spinner/Spinner';

export default function Profile({ comment }) {
    const PUBLIC_FOLDER = process.env.REACT_APP_PUBLIC_FOLDER
    const [user, setUser] = useState({});
    const [profileTab, setProfileTab] = useState("diary");
    const [isEditting, setIsEditting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const dispatch = useDispatch();
    const currentUser = useSelector((state) => {
    return state.AuthReducer.user;
    });
    const { username } = useParams();
    const [isFollow, setIsFollow] = useState(false);
    const navigate = useNavigate(); //ここで一度初期化
    useEffect(() => {
        const fetchUser = async () => {
            try {
                //console.log(username);
                const res = await axios.get(`/users?username=${username}`);
                setUser(res.data);
            } catch (err) {
                console.log(err);
                navigate("/error", { state: { message: "データの取得に失敗しました。後ほど再試行してください。" } });
                //なぜNavigateではダメなのか
            }
        }
        fetchUser();
    }, [username]);

    useEffect(() => {
        try {
            setIsFollow(currentUser?.followings.includes(user._id));
        } catch (err) {
            console.log(err);
            navigate("/error", { state: { message: "予期しないエラーが発生しました。もう一度お試しください。" } });
        } finally {
            setTimeout(() => {
                setIsLoading(false);
            },500)
        }
    }, [currentUser?.followings, user._id]);

    const handleFollow = async () => {
        if (!isFollow) {
            try {
                const res = await axios.put(`/users/${username}/follow`, { username: currentUser.username });
                await followCall(res.data, dispatch);
            } catch (err) {
                console.log(err);
                navigate("/error", { state: { message: "予期しないエラーが発生しました。もう一度お試しください。" } });
            }
        } else {
            try {
                const res = await axios.put(`/users/${username}/unfollow`, { username: currentUser.username });
                await unfollowCall(res.data, dispatch);
            } catch (err) {
                console.log(err);
                navigate("/error", { state: { message: "予期しないエラーが発生しました。もう一度お試しください。" } });
            }
        }
        setIsFollow(!isFollow);
        window.location.reload();
    }

    if (isEditting) {
        return (
            <>
                <Sidebar></Sidebar>
                <EditProfile setIsEditting={setIsEditting}></EditProfile>
            </>
        )
    }
    
    return (
        <>
            <div className="ProfileContainer">
                <div className="ProfileLeft">
                    <Sidebar ></Sidebar>
                </div>
                {isLoading ? <div className="ProfileLight">
                    <div className="ProfileLightSpinner"><Spinner></Spinner></div>
                </div>
                    :
                    <div className="ProfileLight">
                        <div className="ProfileLightTop">
                            <div className="ProfileLightTopUser">
                                <div className="ProfileLightTopDetails">
                                    <img className='ProfileLightTopIcon' src={user.profilePicture ? user?.profilePicture : PUBLIC_FOLDER + "/person/noAvatar.png"} alt="" />
                                    <h2 className='ProfileLightTopName'>{user.username}</h2>
                                    <div className="ProfileLightTopFollowDisp">
                                        <div>
                                            <small>フォロー</small>
                                            <small>{user.followings ? user.followings.length : 0}</small>
                                        </div>
                                        <div className='ProfileLightTopFollowRight'>
                                            <small>フォロワー</small>
                                            <small>{user.followers ? user.followers.length : 0}</small>
                                        </div>
                                    </div>
                                    <h5 className='ProfileLightTopDesc'>{user.desc}</h5>
                                    {currentUser?._id === user._id ? <span className='ProfileLightTopEdit' onClick={() => setIsEditting(true)} >プロフィールを編集</span> : <button className={isFollow ? 'ProfileLightTopFollow' : 'ProfileLightTopFollow2'} onClick={handleFollow}>{isFollow ? "フォローを外す" : "フォローする"}</button>}
                                </div>
                            </div>

                        </div>
                        <div className="ProfileLightBottom">
                            <div className="ProfileTop">
                                <div className="ProfileSwitch">
                                    <div onClick={() => setProfileTab("diary")} className={profileTab === "diary" ? "DiaryButtonActive" : "DiaryButton"}>日記</div>
                                    <div onClick={() => setProfileTab("like")} className={profileTab === "like" ? "ProfileButtonActive" : "ProfileButton"}>いいね</div>
                                </div>
                            </div>
                            <div className="ProfileLightBottomTimeline">
                                {comment ? <Timeline comment username={username}></Timeline> : <Timeline profileTab={profileTab} username={username}></Timeline>}
                            </div>
                        </div>
                    </div>
                }
                
            </div>
        </>
    );
}
