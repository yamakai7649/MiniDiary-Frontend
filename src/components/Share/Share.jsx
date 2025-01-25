import { useRef,useState } from 'react';
import "./Share.css";
import CropOriginalIcon from '@mui/icons-material/CropOriginal';
import { useSelector } from "react-redux";
import axios from "axios";
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';


export default function Share({ comment }) {
    const navigate = useNavigate();
    const [file, setFile] = useState();
    //console.log(file);
    const desc = useRef();
    const postId = useParams();
    const PUBLIC_FOLDER = process.env.REACT_APP_PUBLIC_FOLDER
    const user = useSelector((state) => {
        return state.AuthReducer.user;
    });
    const handleSubmit = async(e) => {
        e.preventDefault();
        const newPost = {
            userId: user._id,
            desc: desc.current.value,
        }
        try {
            if (file) {
                const data = new FormData();
                const fileName = Date.now() + file.name;
                data.append("name", fileName);
                data.append("file", file);
                newPost.img = fileName;
                await axios.post("/upload/", data);
                comment ? 
                await axios.post(`/comments/${postId.postId}`,newPost):
                await axios.post("/posts/", newPost);
                window.location.reload();
            } else {
                comment ? 
                await axios.post(`/comments/${postId.postId}`,newPost):
                await axios.post("/posts/", newPost);
                window.location.reload();
            }
        } catch (err) {
            console.log(err);
            navigate("/error", { state: { message: "予期しないエラーが発生しました。もう一度お試しください。" } });
        }
    }
    return (
      <div className="ShareContainerContainer">
    <form className='ShareContainer' onSubmit={handleSubmit}>
              <img className='ShareTopImage' src={user?.profilePicture ?
                  PUBLIC_FOLDER + user?.profilePicture : PUBLIC_FOLDER + "/person/noAvatar.png"
              } />
                    <textarea wrap="hard" className="ShareTopInp" placeholder={comment ? "コメントする" : '今何してる？'} ref={desc} required maxLength={500}></textarea>
                    <button className='ShareBottomButton'><span className='ShareBottomButtonSpan'>送信</span></button>
            </form>
            </div>
  )
}
