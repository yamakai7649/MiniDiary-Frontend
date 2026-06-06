import PostTimeline from './PostTimeline';
import CommentTimeline from './CommentTimeline';

export default function Timeline({ username, comment, profileTab }) {
  if (comment) {
    return <CommentTimeline username={username} />;
  }
  return <PostTimeline username={username} profileTab={profileTab} />;
}
