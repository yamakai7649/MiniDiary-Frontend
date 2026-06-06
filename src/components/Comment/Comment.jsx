import { useEffect, useState } from "react";
import "./Comment.css";
import axios from "axios";
import { format } from "timeago.js";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import Delete from "../Delete/Delete";

const PUBLIC_FOLDER = process.env.REACT_APP_PUBLIC_FOLDER;
const fetchErrorMessage = "データの取得に失敗しました。後ほど再試行してください。";
const deleteErrorMessage = "予期しないエラーが発生しました。もう一度お試しください。";

export default function Comment({ comment, post, onDelete }) {
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);
  const [user, setUser] = useState({});
  const currentUser = useSelector((state) => state.AuthReducer.user);

  const commentUserId = comment?.userId;
  const isPostOwner = currentUser?._id === post?.userId;
  const isCommentOwner = currentUser?._id === commentUserId;
  const canDelete = isPostOwner || isCommentOwner;
  const profileImage = user.profilePicture || `${PUBLIC_FOLDER}/person/noAvatar.png`;
  const profilePath = user.username ? `/profile/${user.username}` : "/";

  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (!commentUserId) return;

        const res = await axios.get("/users", {
          params: { userId: commentUserId },
        });

        setUser(res.data);
      } catch (err) {
        console.log(err);
        navigate("/error", { state: { message: fetchErrorMessage } });
      }
    };

    fetchUser();
  }, [commentUserId, navigate]);

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

  const openDeleteDialog = () => {
    if (canDelete) {
      setIsDeleting(true);
    }
  };

  return (
    <>
      {isDeleting && canDelete && (
        <Delete comment handleDelete={handleDelete} setIsDeleting={setIsDeleting} />
      )}
      <div className="CommentContainerContainer" onClick={openDeleteDialog}>
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
