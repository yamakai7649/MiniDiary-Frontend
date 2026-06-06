import { useEffect, useState } from 'react';
import "./Timeline.css";
import Post from "../Post/Post";
import Diary from "../Diary/Diary";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate, Link } from 'react-router-dom';
import CreateIcon from '@mui/icons-material/Create';
import Spinner from '../Spinner/Spinner';

export default function PostTimeline({ username, profileTab }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("timeline");
  const [posts, setPosts] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const PUBLIC_FOLDER = process.env.REACT_APP_PUBLIC_FOLDER || "/images/";
  const defaultProfileImage = PUBLIC_FOLDER + "person/noAvatar.png";
  const user = useSelector((state) => state.AuthReducer.user);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
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
        setPosts(res.data);
      } catch (err) {
        console.log(err);
        navigate("/error", { state: { message: "データの取得に失敗しました。後ほど再試行してください。" } });
      } finally {
        setTimeout(() => setIsLoading(false), 200);
      }
    };
    fetchPosts();
  }, [username, user?._id, activeTab, profileTab, navigate]);

  if (isLoading && username) {
    return <div className="PostTimelineSpinner"><Spinner /></div>;
  }

  if (!isLoading && !posts.length && username && profileTab === "diary") {
    return <h3 className='ProfileNoDiary'>日記が見つかりません</h3>;
  }

  if (!isLoading && !posts.length && username && profileTab === "like") {
    return <h3 className='ProfileNoDiary'>「いいね」した日記が見つかりません</h3>;
  }

  return (
    <div className={username ? "ProfileTimelineContainer" : "TimelineContainer"}>
      {!username && (
        <div className="TimelineTop">
          {windowWidth <= 600 && (
            <Link className='linkWrapper' to={`/profile/${user?.username}`}>
              <img className='TopbarProfile' alt="" src={user?.profilePicture ? user?.profilePicture : defaultProfileImage} />
            </Link>
          )}
          <h2 className="TimelineTitle">タイムライン</h2>
          <div className="TimelineSwitch">
            <div onClick={() => setActiveTab("timeline")} className={activeTab === "timeline" ? "TimelineButtonActive" : "TimelineButton"}>タイムライン</div>
            <div onClick={() => setActiveTab("following")} className={activeTab === "following" ? "FollowingButtonActive" : "FollowingButton"}>フォロー中</div>
          </div>
        </div>
      )}

      {isLoading ? (
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

      <div className="CreateDiaryContainer">
        <div className="CreateDiary" onClick={() => setModalOpen(true)}>
          <CreateIcon className='CreateDiaryIcon' />
        </div>
      </div>
      {isModalOpen && <Diary
        closeModal={() => setModalOpen(false)}
        onPostCreated={(newPost) => {
          setPosts(prev => [newPost, ...prev]);
          setModalOpen(false);
        }}
      />}
    </div>
  );
}
