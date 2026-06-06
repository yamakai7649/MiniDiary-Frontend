import {useRef,useState,useEffect} from 'react'
import "./Diary.css";
import ReactDOM from "react-dom";
import axios from "axios";
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';
import { format } from "date-fns";
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';

export default function Diary({ closeModal, onPostCreated }) {
    const navigate = useNavigate();
    const [file, setFile] = useState();
    const [preview, setPreview] = useState();
    const desc = useRef();

    useEffect(() => {
        document.body.style.overflow = "hidden";

        return () => {
            document.body.style.overflow = "";
        };
    }, []);

    const handleSubmit = async(e) => {
        e.preventDefault();
        const newPost = { desc: desc.current.value };
        try {
            if (file) {
                const data = new FormData();
                data.append("file", file);
                const uploadRes = await axios.post("/upload/", data, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
                newPost.imgId = uploadRes.data.public_id;
                newPost.img = uploadRes.data.imageUrl;
            }
            const res = await axios.post("/posts/", newPost);
            onPostCreated?.(res.data);
        } catch (err) {
            console.log(err);
            navigate("/error", { state: { message: "予期しないエラーが発生しました。もう一度お試しください。" } });
        }
    }

    const selectFile = (e) => {
        const selectedFile = e.target.files[0];
        if (!selectedFile) return;

        setFile(selectedFile);
        const reader = new FileReader();
        reader.readAsDataURL(selectedFile);
        reader.onload = () => {
            setPreview(reader.result);
        }
        reader.onerror = () => {
            console.log(reader.error);
            navigate("/error", { state: { message: "予期しないエラーが発生しました。もう一度お試しください。" } });
        }
        e.target.value = "";
    }

    const closePreview = () => {
        setPreview("");
        setFile("");
    }


    return (
        ReactDOM.createPortal(
            <>
                <div className="DiaryContainer">
                    <form className={preview ? "Diary2" : "Diary"} onSubmit={handleSubmit}>
                        <div className={preview ? "DiaryContent2" : "DiaryContent"}>
                            <div className='DiaryTopTime'>
                                <span className='DiaryTopTimeLeft'>{format(new Date(), "M/d")}</span>
                                <small className='DiaryTopTimeRight'>{format(new Date(), "yyyy")}</small>
                            </div>
                            {preview && <div className="DiaryPreview">
                                <img className="DiaryPreviewImage" alt="" src={preview} />
                                <div className="DiaryPreviewCloser" onClick={closePreview}><CloseIcon style={{fontSize:"small"}}></CloseIcon></div>
                            </div>}
                            <textarea className={preview ? "DiaryTextarea2":'DiaryTextarea'} placeholder='あなたの心に浮かぶ言葉をここに書いてみませんか？' ref={desc} required maxLength={500} ></textarea>
                            <label className="DiaryPictureButton" htmlFor='picture' >
                                <AddPhotoAlternateIcon fontSize="small" className="DiaryPictureButtonIcon"></AddPhotoAlternateIcon>
                            </label>
                            <input type="file" id="picture" style={{display:"none"}} onChange={selectFile}/>
                        </div>
                        <div className="DiaryButtons">
                            <div className="CancelButton" onClick={closeModal}>キャンセル</div>
                            <button className='DiaryButton2' >日記する</button>
                        </div>
                    </form>
                </div>
            </>,
            document.getElementById("modal-root")
        )
    );
}
