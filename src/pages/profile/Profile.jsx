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
    const PUBLIC_FOLDER = process.env.REACT_APP_PUBLIC_FOLDER || "/images/";
    const defaultProfileImage = PUBLIC_FOLDER + "person/noAvatar.png";
    const [user, setUser] = useState({});
    const [profileTab, setProfileTab] = useState("diary");
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const dispatch = useDispatch();
    const currentUser = useSelector((state) => {
    return state.AuthReducer.user;
    });
    const { username } = useParams();
    const [isFollow, setIsFollow] = useState(false);
    const navigate = useNavigate();
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await axios.get(`/users?username=${username}`);
                setUser(res.data);
            } catch (err) {
                console.log(err);
                navigate("/error", { state: { message: "データの取得に失敗しました。後ほど再試行してください。" } });
            }
        }
        fetchUser();
    }, [username, navigate]);

    useEffect(() => {
        try {
            setIsFollow(currentUser?.followings.includes(user._id));
        } catch (err) {
            console.log(err);
            navigate("/error", { state: { message: "予期しないエラーが発生しました。もう一度お試しください。" } });
        } finally {
            setIsLoading(false);
        }
    }, [currentUser?.followings, user._id, navigate]);

    const handleFollow = async () => {
        const updatedFollowers = isFollow
            ? (user.followers || []).filter(id => id !== currentUser._id)
            : [...(user.followers || []), currentUser._id];
        
        setUser(prev => ({ ...prev, followers: updatedFollowers }));
        setIsFollow(!isFollow);

        try {
            if (!isFollow) {
                const res = await axios.put(`/users/${username}/follow`);
                await followCall(res.data, dispatch);
            } else {
                const res = await axios.put(`/users/${username}/unfollow`);
                await unfollowCall(res.data, dispatch);
            }
            const res = await axios.get(`/users?username=${username}`);
            setUser(res.data);
        } catch (err) {
            console.log(err);
            navigate("/error", { state: { message: "予期しないエラーが発生しました。もう一度お試しください。" } });
        }
    }

    if (isEditing) {
        return (
            <>
                <Sidebar></Sidebar>
                <EditProfile setIsEditing={setIsEditing}></EditProfile>
            </>
        )
    }
    
    return (
        <>
            <div className="ProfileContainer">
                <div className="ProfileLeft">
                    <Sidebar ></Sidebar>
                </div>
                {isLoading ? <div className="ProfileSpinnerContainer">
                    <Spinner></Spinner>
                </div>
                    :
                    <div className="ProfileLight" key={username}>
                        <div className="ProfileLightTop">
                            <div className="ProfileLightTopUser">
                                <div className="ProfileLightTopDetails">
                                    <img className='ProfileLightTopIcon' src={user.profilePicture ? user?.profilePicture : defaultProfileImage} alt="" />
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
                                    {currentUser?._id === user._id ? <span className='ProfileLightTopEdit' onClick={() => setIsEditing(true)} >プロフィールを編集</span> : <button className={isFollow ? 'ProfileLightTopFollow' : 'ProfileLightTopFollow2'} onClick={handleFollow}>{isFollow ? "フォローを外す" : "フォローする"}</button>}
                                </div>
                            </div>

                        </div>
                        <div className="ProfileLightBottom">
                            {!comment && (
                                <div className="ProfileTop">
                                    <div className="ProfileSwitch">
                                        <div onClick={() => setProfileTab("diary")} className={profileTab === "diary" ? "DiaryButtonActive" : "DiaryButton"}>日記</div>
                                        <div onClick={() => setProfileTab("like")} className={profileTab === "like" ? "ProfileButtonActive" : "ProfileButton"}>いいね</div>
                                    </div>
                                </div>
                            )}
                            <div className="ProfileLightBottomTimeline">
                                {comment ? <Timeline comment username={username} /> : <Timeline profileTab={profileTab} username={username} />}
                            </div>
                        </div>
                    </div>
                }
                
            </div>
        </>
    );
}
