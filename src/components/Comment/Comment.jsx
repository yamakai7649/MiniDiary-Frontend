import {useState,useEffect} from 'react'
import "./Comment.css";
import axios from "axios";
import { format } from "timeago.js";
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import Delete from '../Delete/Delete';
import { useSelector } from 'react-redux';

export default function Comment({ comment,post }) {
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);
  const [user, setUser] = useState({});
  const currentUser = useSelector((state) => {
    return state.AuthReducer.user;
  });
  const PUBLIC_FOLDER = process.env.REACT_APP_PUBLIC_FOLDER
  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (comment[0]) {
          const res = await axios.get(`/users?userId=${comment[0].userId}`);
          setUser(res.data);
        }
      } catch (err) {
        console.log(err);
        navigate("/error", { state: { message: "データの取得に失敗しました。後ほど再試行してください。" } });
      }
    }
    fetchUser();
  }, [comment.userId]);

  const handleDelete = async () => {
    try {
      await axios.delete(`/comments/${comment[0]._id}?userId=${user._id}`);
      window.location.reload();
    } catch (err) {
      console.log(err);
      navigate("/error", { state: { message: "予期しないエラーが発生しました。もう一度お試しください。" } });
    }
  }

  return (
    <>
      {isDeleting && currentUser?._id === post?.userId ? <Delete comment handleDelete={handleDelete} setIsDeleting={setIsDeleting}></Delete> : null}
      {isDeleting && currentUser?._id === comment[0].userId  ? <Delete comment handleDelete={handleDelete} setIsDeleting={setIsDeleting}></Delete> : null}
      <div className="CommentContainerContainer" onClick={()=> setIsDeleting(true)}>
        <div className='CommentContainer'>
          <div className="CommentTop">
            <Link className='CommentLinkWrapper' to={`/profile/${user.username}`}>
              <img src={user.profilePicture ?
                PUBLIC_FOLDER + user.profilePicture : PUBLIC_FOLDER + "/person/noAvatar.png"
              } alt="" className="CommentTopImage" />
            </Link>
            <strong className="CommentTopName">{user.username}</strong>
            <small className="CommentTopTime">{format(comment[0]?.createdAt)}</small>
          </div>
          <div className="CommentContent">
            <small className="CommentContentComment">{comment[0]?.desc}</small>
          </div>
        </div>
      </div>
    </>
  );
}
