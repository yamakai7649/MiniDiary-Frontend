import { useEffect, useState } from 'react';
import "./Timeline.css";
import Post from "../Post/Post";
import Diary from "../Diary/Diary";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate, Link } from 'react-router-dom';
import CreateIcon from '@mui/icons-material/Create';
import Spinner from '../Spinner/Spinner';
import ReactDOM from "react-dom";

export default function PostTimeline({ username, profileTab }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("timeline");
  const [posts, setPosts] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadedKey, setLoadedKey] = useState(null);
  const PUBLIC_FOLDER = process.env.REACT_APP_PUBLIC_FOLDER || "/images/";
  const defaultProfileImage = PUBLIC_FOLDER + "person/noAvatar.png";
  const user = useSelector((state) => state.AuthReducer.user);

  useEffect(() => {
    const requestKey = username ? `${username}:${profileTab}` : `home:${activeTab}`;
    let ignore = false;

    setIsLoading(true);
    const fetchPosts = async () => {
      try {
        let res;
        if (username) {
          res = profileTab === "like"
            ? await axios.get(`/posts/like/?username=${username}`)
            : await axios.get(`/posts/profile/${username}`);
        } else if (activeTab === "following") {
          res = await axios.get(`/posts/following/${user?._id}`);
        } else {
          res = await axios.get(`/posts/timeline`);
        }
        if (ignore) return;
        setPosts(res.data);
        setLoadedKey(requestKey);
      } catch (err) {
        if (ignore) return;
        console.log(err);
        navigate("/error", { state: { message: "データの取得に失敗しました。後ほど再試行してください。" } });
      } finally {
        setTimeout(() => {
          if (!ignore) setIsLoading(false);
        }, 500);
      }
    };
    fetchPosts();

    return () => {
      ignore = true;
    };
  }, [username, user?._id, activeTab, profileTab, navigate]);

  const currentKey = username ? `${username}:${profileTab}` : `home:${activeTab}`;
  const isCurrentPostsLoading = isLoading || loadedKey !== currentKey;
  const createDiaryButton = !username ? ReactDOM.createPortal(
    <div className="CreateDiaryContainer">
      <div className="CreateDiary" onClick={() => setModalOpen(true)}>
        <CreateIcon className='CreateDiaryIcon' />
      </div>
    </div>,
    document.body
  ) : null;

  if (isCurrentPostsLoading && username) {
    return (
      <>
        <div className="PostTimelineSpinner"><Spinner /></div>
        {createDiaryButton}
        {isModalOpen && <Diary
          closeModal={() => setModalOpen(false)}
          onPostCreated={(newPost) => {
            setPosts(prev => [newPost, ...prev]);
            setModalOpen(false);
          }}
        />}
      </>
    );
  }

  if (!isCurrentPostsLoading && !posts.length && username && profileTab === "diary") {
    return <h3 className='ProfileNoDiary'>日記が見つかりません</h3>;
  }

  if (!isCurrentPostsLoading && !posts.length && username && profileTab === "like") {
    return <h3 className='ProfileNoDiary'>「いいね」した日記が見つかりません</h3>;
  }

  return (
    <>
      <div className={username ? "ProfileTimelineContainer" : "TimelineContainer"}>
        {!username && (
          <div className="TimelineTop">
            <Link className='linkWrapper TimelineTopProfileLink' to={`/profile/${user?.username}`}>
              <img className='TopbarProfile' alt="" src={user?.profilePicture ? user?.profilePicture : defaultProfileImage} />
            </Link>
            <h2 className="TimelineTitle">タイムライン</h2>
            <div className="TimelineSwitch">
              <div onClick={() => { setActiveTab("timeline"); setIsLoading(true); }} className={activeTab === "timeline" ? "TimelineButtonActive" : "TimelineButton"}>タイムライン</div>
              <div onClick={() => { setActiveTab("following"); setIsLoading(true); }} className={activeTab === "following" ? "FollowingButtonActive" : "FollowingButton"}>フォロー中</div>
            </div>
          </div>
        )}

        {isCurrentPostsLoading ? (
          <div className="PostTimelineSpinner2"><Spinner /></div>
        ) : posts.length > 0 ? (
          <div className={username ? null : "TimelineContainer2"}>
            {posts
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
              .map((post) => (
                <div className='TimelinePostContainer' key={post._id}>
                  <Post post={post} username={username || null} onDelete={(id) => setPosts(prev => prev.filter(p => p._id !== id))} />
                </div>
              ))}
          </div>
        ) : (
          <h2 className='TimelineNoDiary'>日記がありません</h2>
        )}
      </div>

      {createDiaryButton}
      {isModalOpen && <Diary
        closeModal={() => setModalOpen(false)}
        onPostCreated={(newPost) => {
          setPosts(prev => [newPost, ...prev]);
          setModalOpen(false);
        }}
      />}
    </>
  );
}
