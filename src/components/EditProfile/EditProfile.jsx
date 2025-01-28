import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Spinner from '../Spinner/Spinner';
import axios from "axios";
import "./EditProfile.css"

export default function EditProfile({setIsEditting}) {
    const PUBLIC_FOLDER = process.env.REACT_APP_PUBLIC_FOLDER
    const navigate = useNavigate(); //ここで一度初期化
    const [isLoading, setIsLoading] = useState(true);
    const user = useSelector((state) => {
    return state.AuthReducer.user;
    });
    const fileInputRef = useRef();
    const [username, setUsername] = useState(user?.username);
    const usernameRef = useRef();
    const [desc, setDesc] = useState(user?.desc);
    const [file, setFile] = useState();
    const [preview, setPreview] = useState();
    
    const openFileDialog = () => {
        fileInputRef.current.click();   
    }

    useEffect(() => {
        setTimeout(() => {
            setIsLoading(false);
        },250)
    },[])

    const selectFile = (e) => {
        setFile(e.target.files[0]);
        const reader = new FileReader();
        reader.readAsDataURL(e.target.files[0]);
        reader.onload = () => {
            setPreview(reader.result);
        }
        reader.onerror = () => {
            console.log(reader.error);
            navigate("/error", { state: { message: "予期しないエラーが発生しました。もう一度お試しください。" } });
        }
        e.target.value = "";
    }

    const handleEdit = async (e) => {
        e.preventDefault();
        try {
            if (usernameRef.current.value.length < 4 || usernameRef.current.value.length > 15) {
                usernameRef.current.setCustomValidity("ユーザー名は4文字以上、15文字以内で入力してください。");
                usernameRef.current.reportValidity();
                return;
            }
            if (file) {
                const data = new FormData();
                data.append("file", file);
                const res = await axios.post("/upload/", data, {
                    headers: {
                    "Content-Type": "multipart/form-data",
                },
                });
                const imageId = res.data.public_id;
                const imageUrl = res.data.imageUrl;
                if (user.profilePicture) {
                    await axios.delete(`/upload/delete?public_id=${user.profilePictureId}`);
                }
                await axios.put(`/users/${user?._id}`, { username: username, desc: desc, profilePicture: imageUrl, profilePictureId: imageId });
                setIsEditting(false);
                navigate(`/profile/${username}`);
                return window.location.reload();
            }
            await axios.put(`/users/${user?._id}`, { username: username, desc: desc });
            setIsEditting(false);
            navigate(`/profile/${username}`);
            window.location.reload();
        } catch (err) {
            console.log(err);
            navigate("/error", { state: { message: "予期しないエラーが発生しました。もう一度お試しください。" } });
        }
    }

    if (isLoading) {
        return (
            <div className="EditProfileSpinner"><Spinner></Spinner></div>
        )
    }

    return (
        <>
            <form className="EditProfileContainer">
                <div className="EditProfileTop">
                    <h3 className="EditProfileTopBack" onClick={()=> setIsEditting(false)}>←</h3>
                    <h3 className="EditProfileTopHeading">プロフィール編集</h3>
                    <div className="EditProfileTopSave" onClick={handleEdit}>保存</div>
                </div>
                <div className="EditProfileIcon">
                    <img src={preview ? preview : user.profilePicture ? user?.profilePicture : PUBLIC_FOLDER + "/person/noAvatar.png"} className="EditProfileIconImage" onClick={openFileDialog} />
                    <input type="file" id="ProfileIcon" style={{display:"none"}} ref={fileInputRef} onChange={selectFile}/>
                </div>
                <div className="EditProfileName">
                    <strong className="EditProfileNameHeading">ユーザー名</strong>       
                    <div className="EditProfileNameName" ><input type="text" value={username} onChange={(e)=> setUsername(e.target.value)} required ref={usernameRef} onInput={()=> usernameRef.current.setCustomValidity("")}/></div>
                </div>
                <div className="EditProfileDesc">
                    <strong className="EditProfileDescHeading">自己紹介文</strong>
                    <div className="EditProfileDescDesc"><textarea value={desc} onChange={(e)=> setDesc(e.target.value)} maxLength={400}></textarea></div>
                </div>
            </form>
        </>
    );
}
