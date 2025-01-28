import {useEffect, useState} from 'react'
import "./Timeline.css";
import Share from "../Share/Share";
import Post from "../Post/Post";
import Diary from "../Diary/Diary";
import axios from "axios";
import { useSelector } from "react-redux";
import { useParams } from 'react-router-dom';
import Comment from '../Comment/Comment';
import { useNavigate } from 'react-router-dom';
import { Link } from "react-router-dom";
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import CreateIcon from '@mui/icons-material/Create';
import Spinner from '../Spinner/Spinner';

export default function Timeline({ username, comment, profileTab }) {
  const PostTimeline = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("timeline");
    const [posts, setPosts] = useState([]);
    const [isModalOpen, setModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const PUBLIC_FOLDER = process.env.REACT_APP_PUBLIC_FOLDER
    const user = useSelector((state) => {
      return state.AuthReducer.user;
    });
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    const openModal = () => {
      setModalOpen(true);
    }

    const closeModal = () => {
      setModalOpen(false);
    }

    const openTimeline = () => {
      setActiveTab("timeline");
      window.location.reload();
    }

    useEffect(() => {
      window.addEventListener("resize", () => setWindowWidth(window.innerWidth));
      
      return () => {
        window.removeEventListener("resize", () => setWindowWidth(window.innerWidth));
      };
    }, []);

    useEffect(() => {
      const fetchPosts = async () => {
        try {
          let res;
          if (activeTab === "timeline") {
            res = await axios.get(`/posts/timeline`);
          } else {
            //console.log(user);
            res = await axios.get(`/posts/following/${user?._id}`);
          }
          if (username) {
            profileTab === "like" ?
              res = await axios.get(`/posts/like/?username=${username}`) :
              res = await axios.get(`/posts/profile/${username}`);
          }
          setPosts(res.data);
        } catch (err) {
          console.log(err);
          navigate("/error", { state: { message: "データの取得に失敗しました。後ほど再試行してください。" } });
        } finally {
          setTimeout(() => {
            setIsLoading(false);
          }, 500);
        }
      }
      fetchPosts();
    }, [username, user?._id, activeTab]);

    if (isLoading && username) {
      return (
        <>
          <div className="PostTimelineSpinner"><Spinner></Spinner></div>
        </>
      )
    }

    if (!isLoading && !posts.length && username && profileTab === "diary") {
      return (
        <>
          <h3 className='ProfileNoDiary'>日記が見つかりません</h3>
        </>
      )
    }

    if (!isLoading && !posts.length && username && profileTab === "like") {
      return (
        <>
          <h3 className='ProfileNoDiary'>「いいね」した日記が見つかりません</h3>
        </>
      )
    }

  

    return (
      <>
        <div className={username ? "ProfileTimelineContainer" : "TimelineContainer"}>
          {username ? null : windowWidth <= 600 ? 
            <div className="TimelineTop">
              <Link className='linkWrapper' to={`/profile/${user?.username}`} style={{ textDecoration: "none", color: "black" }}>
                    <img className='TopbarProfile' src={user?.profilePicture ?
                  user?.profilePicture : PUBLIC_FOLDER + "/person/noAvatar.png"
              } />
              </Link>
            <h2 className="TimelineTitle">タイムライン</h2>
            <div className="TimelineSwitch">
              <div onClick={() => setActiveTab("timeline")} className={activeTab === "timeline" ? "TimelineButtonActive" : "TimelineButton"}>タイムライン</div>
              <div onClick={() => setActiveTab("following")} className={activeTab === "following" ? "FollowingButtonActive" : "FollowingButton"}>フォロー中</div>
            </div>
          </div>
          :  
            <div className="TimelineTop">
            <h2 className="TimelineTitle">タイムライン</h2>
            <div className="TimelineSwitch">
              <div onClick={() => setActiveTab("timeline")} className={activeTab === "timeline" ? "TimelineButtonActive" : "TimelineButton"}>タイムライン</div>
              <div onClick={() => setActiveTab("following")} className={activeTab === "following" ? "FollowingButtonActive" : "FollowingButton"}>フォロー中</div>
            </div>
            </div>}
          

          {isLoading ? <div className="PostTimelineSpinner2">{username ? null:<Spinner></Spinner>}</div>
          : posts.length > 0 ?
            <div className={username ? null : "TimelineContainer2"}>
            {posts
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
              .map((post) => (
                <div className='TimelinePostContainer' key={post._id}>
                  <Post post={post} key={post._id} username={username ? username : null}></Post>
                </div>
                
              ))}
            </div> :
            <h2 className='TimelineNoDiary'>日記がありません</h2>
            }
          
          <div className="CreateDiaryContainer" >
                <div className="CreateDiary" onClick={openModal}>
              <CreateIcon className='CreateDiaryIcon'></CreateIcon>
          </div>
          </div>
          {isModalOpen && <Diary closeModal={closeModal}></Diary>}
        </div>
      </>
    );
  }

  const CommentTimeline = () => {
    const navigate = useNavigate();
    const { postId } = useParams();
    const [comments, setComments] = useState([]);
    const [post, setPost] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    

    useEffect(() => {
      const fetchPost = async () => {
        try {
          const res = await axios.get(`/posts/${postId}`);
          setPost(res.data);
        } catch (err) {
          console.log(err);
          navigate("/error", { state: { message: "データの取得に失敗しました。後ほど再試行してください。" } });
        }
      }

      const fetchComments = async () => {
        try {
          const res = await axios.get(`/comments/timeline/${postId}`);
          setComments(res.data);
        } catch (err) {
          console.log(err);
          navigate("/error", { state: { message: "データの取得に失敗しました。後ほど再試行してください。" } });
        } finally {
          setTimeout(() => {
            setIsLoading(false);
          },500);
        }
      }

      fetchPost();
      fetchComments();
    }, [postId]);


    return (
      <>

        {post && comment &&
          <div className={username ? null : "TimelineContainer"}>
            {isLoading && <div className={username ? 'CommentTimelineSpinner': "CommentTimelineSpinner2"}><Spinner></Spinner></div> }
            {!isLoading && <div className={username ? "TimelinePostContainer2" : "TimelinePostContainer"}>
              <Post post={post} key={post._id} comment={true} username={username}></Post>
            </div>}
            {!isLoading && <Share comment={comment}></Share>}
            {!isLoading && <div className="Comment">
              <div className="CommentNumber">
                <div className="CommentNumberContainer">
                  <ChatBubbleOutlineIcon className='CommentNumberIcon'></ChatBubbleOutlineIcon>
                  <div className='CommentNumberTitle'>コメント</div>
                  <small className='CommentNumberNumber'>（{comments.length} 件）</small>
                </div>
              </div>
              {comments
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .map((comment) => (
                  <Comment comment={comment} post={post} key={comment[0]?._id}></Comment>
                ))}
            </div>}
          </div>
        }
        
      </>
    );
  }

  return (
    comment ? <CommentTimeline></CommentTimeline> : <PostTimeline></PostTimeline>
  );
}



  
