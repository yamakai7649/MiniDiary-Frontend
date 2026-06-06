import { useRef } from 'react';
import "./CommentForm.css";
import { useSelector } from "react-redux";
import axios from "axios";
import { useParams, useNavigate } from 'react-router-dom';

export default function CommentForm({ onCommentCreated }) {
    const navigate = useNavigate();
    const desc = useRef();
    const { postId } = useParams();
    const PUBLIC_FOLDER = process.env.REACT_APP_PUBLIC_FOLDER;
    const user = useSelector((state) => state.AuthReducer.user);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`/comments/${postId}`, { desc: desc.current.value });
            desc.current.value = "";
            onCommentCreated?.(res.data);
        } catch (err) {
            console.log(err);
            navigate("/error", { state: { message: "予期しないエラーが発生しました。もう一度お試しください。" } });
        }
    };

    return (
        <div className="CommentFormContainer">
            <form className='CommentForm' onSubmit={handleSubmit}>
                <img className='CommentFormImage' alt="" src={user?.profilePicture ?
                    user?.profilePicture : PUBLIC_FOLDER + "/person/noAvatar.png"
                } />
                <textarea wrap="hard" className="CommentFormInput" placeholder="コメントする" ref={desc} required maxLength={500} />
                <button className='CommentFormButton'>
                    <span className='CommentFormButtonSpan'>送信</span>
                </button>
            </form>
        </div>
    );
}
