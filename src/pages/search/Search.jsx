import React, { useEffect,useState,useRef } from 'react'
import "./Search.css"
import Sidebar from "../../components/Sidebar/Sidebar";
import Spinner from "../../components/Spinner/Spinner";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

export default function Search() {
    const [users, setUsers] = useState();
    const [isLoading, setIsLoading] = useState(true);
    const inputRef = useRef();
    const navigate = useNavigate();
    const PUBLIC_FOLDER = process.env.REACT_APP_PUBLIC_FOLDER
    const user = useSelector((state) => {
      return state.AuthReducer.user;
    });
    const [value, setValue] = useState();

    useEffect(() => {
        const fetchRandomUser = async () => {
            try {
                const res = await axios.get(`/users/recommendation?username=${user.username}`);
                setUsers(res.data);
            } catch (err) {
                console.log(err);
                navigate("/error", { state: { message: "データの取得に失敗しました。後ほど再試行してください。" } });
            } finally {
                setTimeout(() => {
                    setIsLoading(false);
                },250)
            }
        }
        fetchRandomUser();
    }, [user.username]);
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.get(`/users/?username=${value}`);
            const user = res.data;
            if (user) {
                return navigate(`/profile/${user.username}`);
            }
        } catch (err) {
            inputRef.current.setCustomValidity("該当するユーザーがいません");
            inputRef.current.reportValidity();
            return;
        }
    };

    return (
        <>
            <Sidebar></Sidebar>
            <div className="SearchContainer">
                <div className="SearchTop">
                    <h3 className="SearchTopCenter">ユーザーを探す</h3>
                </div>
                <form className="SearchForm" onSubmit={handleSubmit}>
                    <strong className="SearchFormHeading">ユーザー名で検索</strong>
                    <input type="text" className="SearchFormInp" onChange={(e) => setValue(e.target.value)} ref={inputRef} onInput={() => inputRef.current.setCustomValidity("")} />
                </form>
                <div className="SearchRecommendation">
                    <p className="SearchRecommendationTop">おすすめユーザー</p>
                    {isLoading ? <div className="SearchSpinner"><Spinner></Spinner></div> :
                        <div className="SearchRecommendationPeople">
                            {users?.map((user) => (
                                <Link to={`/profile/${user.username}`} style={{ color: "inherit", textDecoration: "none" }} key={user._id}>
                                    <div className="SearchRecommendationPersonContainer" >
                                        <div className="SearchRecommendationPerson">
                                            <img src={user?.profilePicture ?
                                                user?.profilePicture : PUBLIC_FOLDER + "/person/noAvatar.png"} alt="" className="SearchRecommendationPersonIcon" />
                                            <div className="SearchRecommendationPersonMain">
                                                <div className="SearchRecommendationPersonUsername">{user.username}</div>
                                                <div className="SearchRecommendationPersonFollow">
                                                    <div className="SearchRecommendationPersonFollowLeft">
                                                        <small>フォロー</small>
                                                        <small>{user.followings.length}</small>
                                                    </div>
                                                    <div className="SearchRecommendationPersonFollowRight">
                                                        <small>フォロワー</small>
                                                        <small>{user.followers.length}</small>
                                                    </div>
                                                </div>
                                                <div className="SearchRecommendationPersonDesc">{user.desc}</div>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    }
                    
                </div>
            </div>
        </>
    );
}
