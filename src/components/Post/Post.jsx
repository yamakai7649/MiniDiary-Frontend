import { useState } from 'react'
import "./Post.css";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import Delete from '../Delete/Delete';
import axios from "axios";

export default function Post({ post, username, comment, onDelete }) {
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.AuthReducer.user);
  const [like, setLike] = useState(post.likes.length);
  const [isLiked, setIsLiked] = useState(post.likes.includes(currentUser?._id));
  const [isDeleting, setIsDeleting] = useState(false);
  const PUBLIC_FOLDER = process.env.REACT_APP_PUBLIC_FOLDER || "/images/";
  const defaultProfileImage = PUBLIC_FOLDER + "person/noAvatar.png";
  const user = post.user || {};

  const handleLike = async () => {
    try {
      await axios.put(`/posts/${post._id}/like`);
      setLike(isLiked ? like - 1 : like + 1);
      setIsLiked(!isLiked);
    } catch (err) {
      navigate("/error", { state: { message: "予期しないエラーが発生しました。もう一度お試しください。" } });
      console.log(err);
    }
  };

  const handleDelete = async () => {
    try {
      if (post.img) {
        await axios.delete(`/upload/delete?public_id=${post.imgId}`);
      }
      await axios.delete(`/posts/${post._id}`);
      if (onDelete) {
        onDelete(post._id);
      } else {
        navigate(-1);
      }
    } catch (err) {
      console.log(err);
      navigate("/error", { state: { message: "予期しないエラーが発生しました。もう一度お試しください。" } });
    }
  };

  return (
    <>
      {isDeleting ? <Delete handleDelete={handleDelete} setIsDeleting={setIsDeleting} /> : null}
      {comment ? (
        <div className={username ? "PostTopTop2" : "PostTopTop"}>
          <div className="PostTopTopContainer">
            <Link to={username ? `/profile/${username}` : "/"} className="PostTopTopBackLink">
              <h3 className='PostTopTopBack'>←</h3>
            </Link>
            <h3 className='PostTopTopTitle'>日記</h3>
          </div>
        </div>
      ) : null}
      <div className={comment && !username ? "PostContainer2" : 'PostContainer'}>
        <div className="PostTop">
          <div className="PostTopTime">
            <span className='PostTopTimeLeft'>{format(new Date(post.createdAt), "M/d")}</span>
            <small className='PostTopTimeRight'>{format(new Date(post.createdAt), "yyyy")}</small>
          </div>
          {currentUser?.username === user?.username ? (
            <strong className="PostTopBar" onClick={() => setIsDeleting(true)}><DeleteIcon /></strong>
          ) : null}
        </div>
        <div className="PostContent">
          {post.img && <img src={post.img} alt="" className="PostContentImage" />}
          <small className="PostContentComment">{post.desc}</small>
        </div>
        <div className="PostBottom">
          <Link to={`/profile/${user.username}`}>
            <img src={user.profilePicture ? user.profilePicture : defaultProfileImage} alt="" className="PostBottomImage" />
          </Link>
          <div className="PostBottomName">{user.username}</div>
          <div className="PostBottomRight">
            <div className={comment ? "PostBottomLikes2" : "PostBottomLikes"}>
              {isLiked ? (
                <FavoriteIcon className="PostBottomLikesImage" onClick={handleLike} style={{ color: "#ef4444" }} />
              ) : (
                <FavoriteBorderIcon className="PostBottomLikesImage" onClick={handleLike} />
              )}
              <div className="PostBottomLikesDesc">{like}</div>
            </div>
            {comment ? null : (
              <Link className='postLinkWrapper' to={username ? `/profile/${username}/comment/${post._id}` : `/comment/${post._id}`}>
                <div className="PostBottomComment">
                  <ChatBubbleOutlineIcon className="PostBottomCommentIcon" />
                  <span>{post.comments.length}</span>
                </div>
              </Link>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
