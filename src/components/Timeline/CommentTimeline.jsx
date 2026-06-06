import { useEffect, useState } from 'react';
import "./Timeline.css";
import CommentForm from "../CommentForm/CommentForm";
import Post from "../Post/Post";
import Comment from '../Comment/Comment';
import axios from "axios";
import { useParams, useNavigate } from 'react-router-dom';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import Spinner from '../Spinner/Spinner';

export default function CommentTimeline({ username }) {
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
    };

    const fetchComments = async () => {
      try {
        const res = await axios.get(`/comments/timeline/${postId}`);
        setComments(res.data);
      } catch (err) {
        console.log(err);
        navigate("/error", { state: { message: "データの取得に失敗しました。後ほど再試行してください。" } });
      } finally {
        setTimeout(() => setIsLoading(false), 200);
      }
    };

    fetchPost();
    fetchComments();
  }, [postId, navigate]);

  const handleCommentCreated = (newComment) => {
    setComments(prev => [newComment, ...prev]);
  };

  const handleCommentDelete = (deletedId) => {
    setComments(prev => prev.filter(c => c._id !== deletedId));
  };

  if (!post) return null;

  return (
    <div className={username ? null : "TimelineContainer"}>
      {isLoading && (
        <div className={username ? 'CommentTimelineSpinner' : "CommentTimelineSpinner2"}>
          <Spinner />
        </div>
      )}
      {!isLoading && (
        <div className={username ? "TimelinePostContainer2" : "TimelinePostContainer"}>
          <Post post={post} comment={true} username={username} />
        </div>
      )}
      {!isLoading && <CommentForm onCommentCreated={handleCommentCreated} />}
      {!isLoading && (
        <div className="Comment">
          <div className="CommentNumber">
            <div className="CommentNumberContainer">
              <ChatBubbleOutlineIcon className='CommentNumberIcon' />
              <div className='CommentNumberTitle'>コメント</div>
              <small className='CommentNumberNumber'>（{comments.length} 件）</small>
            </div>
          </div>
          {comments
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .map((comment) => (
              <Comment comment={comment} post={post} key={comment._id} onDelete={handleCommentDelete} />
            ))}
        </div>
      )}
    </div>
  );
}
