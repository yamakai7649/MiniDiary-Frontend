import { useState } from "react";
import "./Comment.css";
import axios from "axios";
import { format } from "timeago.js";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Delete from "../Delete/Delete";

const PUBLIC_FOLDER = process.env.REACT_APP_PUBLIC_FOLDER || "/images/";
const deleteErrorMessage = "予期しないエラーが発生しました。もう一度お試しください。";

export default function Comment({ comment, post, onDelete }) {
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);
  const currentUser = useSelector((state) => state.AuthReducer.user);

  const user = comment.user || {};
  const isPostOwner = currentUser?._id?.toString() === post?.userId;
  const isCommentOwner = currentUser?._id === comment?.userId;
  const canDelete = isPostOwner || isCommentOwner;
  const profileImage = user.profilePicture || `${PUBLIC_FOLDER}person/noAvatar.png`;
  const profilePath = user.username ? `/profile/${user.username}` : "/";

  const handleDelete = async () => {
    try {
      await axios.delete(`/comments/${comment._id}`);
      onDelete?.(comment._id);
      setIsDeleting(false);
    } catch (err) {
      console.log(err);
      navigate("/error", { state: { message: deleteErrorMessage } });
    }
  };

  return (
    <>
      {isDeleting && canDelete && (
        <Delete comment handleDelete={handleDelete} setIsDeleting={setIsDeleting} />
      )}
      <div className="CommentContainerContainer" onClick={() => canDelete && setIsDeleting(true)}>
        <div className="CommentContainer">
          <div className="CommentTop">
            <Link className="CommentLinkWrapper" to={profilePath}>
              <img src={profileImage} alt="" className="CommentTopImage" />
            </Link>
            <strong className="CommentTopName">{user.username}</strong>
            <small className="CommentTopTime">{format(comment?.createdAt)}</small>
          </div>
          <div className="CommentContent">
            <small className="CommentContentComment">{comment?.desc}</small>
          </div>
        </div>
      </div>
    </>
  );
}
