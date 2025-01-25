import {useState,useEffect,} from 'react'
import "./Post.css";
import axios from "axios";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import Delete from '../Delete/Delete';

export default function Post({ post, username, comment }) {
  const navigate = useNavigate();
  const [like, setLike] = useState(post.likes.length);
  const [isLiked, setIsLiked] = useState(false);
  const [user, setUser] = useState({});
  const [isDeleting, setIsDeleting] = useState(false);
  const currentUser = useSelector((state) => {
    return state.AuthReducer.user;
  });
  const PUBLIC_FOLDER = process.env.REACT_APP_PUBLIC_FOLDER
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`/users?userId=${post.userId}`);
        setUser(res.data);
      } catch (err) {
        console.log(err);
        navigate("/error", { state: { message: "データの取得に失敗しました。後ほど再試行してください。" } });
      }
    }
    fetchUser();
  }, [post.userId]);


  const handleLike = async() => {
    try {
      await axios.put(`/posts/${post._id}/like`, { userId: currentUser._id });
      setLike(isLiked ? like -1 : like +1);
      setIsLiked(!isLiked);
    } catch (err) {
      navigate("/error", { state: { message: "予期しないエラーが発生しました。もう一度お試しください。" } });
      console.log(err);
    }
  }

  const handleDelete = async () => {
    try {
      await axios.delete(`/posts/${post._id}?userId=${currentUser._id}`);
      if (post.img) {
        await axios.delete(`/upload/delete?fileName=${post.img}`);
      }
      window.location.reload();
    } catch (err) {
      console.log(err);
      navigate("/error", { state: { message: "予期しないエラーが発生しました。もう一度お試しください。" } });
    }
  }

  

  return (
    <>
      {isDeleting ? <Delete handleDelete={handleDelete} setIsDeleting={setIsDeleting}></Delete> : null}
      {comment ? <div className={username ? "PostTopTop2" :"PostTopTop"}>
        <div className="PostTopTopContainer">
          <Link to={username ? `/profile/${username}`:"/"} style={{color:"inherit",textDecoration:"none",width:0}}>
          <h3 className='PostTopTopBack'>←</h3>  
        </Link> 
        <h3 className='PostTopTopTitle'>日記</h3>
          </div>
        </div>
      : null}
      <div className={comment && !username ? "PostContainer2" :'PostContainer'}>
      <div className="PostTop">
          <div className="PostTopTime">
            <span className='PostTopTimeLeft'>{format(new Date(post.createdAt), "M/d")}</span>
            <small className='PostTopTimeRight'>{format(new Date(post.createdAt), "yyyy")}</small>
        </div>
          {user && currentUser.username === user.username ? <strong className="PostTopBar" onClick={()=> setIsDeleting(true)}><DeleteIcon></DeleteIcon></strong>:null}
      </div>

        <div className="PostContent">
          {post.img && <img src={PUBLIC_FOLDER + post.img} className="PostContentImage"></img>}
          <small className="PostContentComment">{post.desc}</small>
      </div>
        <div className="PostBottom">
          <Link to={`/profile/${user.username}`}>
          <img src={user.profilePicture ?
                  PUBLIC_FOLDER + user.profilePicture : PUBLIC_FOLDER + "/person/noAvatar.png"
              } alt="" className="PostBottomImage" />
        </Link>
          <div className="PostBottomName">{user.username}</div>
          <div className="PostBottomRight">
            <div className={comment ? "PostBottomLikes2" : "PostBottomLikes"}>
          <FavoriteBorderIcon className="PostBottomLikesImage" onClick={()=> handleLike()}></FavoriteBorderIcon>
          <div className="PostBottomLikesDesc">{like}</div>
        </div>
        {comment ? null : <Link className='postLinkWrapper' to={username ? `/profile/${username}/comment/${post._id}` :`/comment/${post._id}`}>
            <div className="PostBottomComment" >
              <ChatBubbleOutlineIcon className="PostBottomCommentIcon"></ChatBubbleOutlineIcon>
              <span>{post.comments.length}</span>
            </div>
        </Link>}
          </div>
      </div>
      </div>
      </>
  )
}
