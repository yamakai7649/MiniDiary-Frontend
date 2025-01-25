import {useRef, useState,useEffect} from 'react'
import "./Login.css"
import { useDispatch } from "react-redux";
import { loginCall } from "../../actionCalls";
import { Link } from "react-router-dom";
import { useNavigate, } from 'react-router-dom';
import axios from "axios";

export default function Login() {
  const navigate = useNavigate();
  const password = useRef();
  const username = useRef();
  const dispatch = useDispatch(); 
  const [user, setUser] = useState();
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    useEffect(() => {
        window.addEventListener("resize", () => setWindowWidth(window.innerWidth));

        return () => {
            window.removeEventListener("resize", () => setWindowWidth(window.innerWidth));
        };
    }, []);

  const handleLogin = async(e) => {
    e.preventDefault();
    if (username.current.value.length < 4 || username.current.value.length > 15) {
      username.current.setCustomValidity("ユーザー名は4文字以上、15文字以内で入力してください。");
      username.current.reportValidity();
      return;
    }

    if (password.current.value.length < 6 || password.current.value.length > 50) {
      password.current.setCustomValidity("パスワードは最低6文字以上で入力してください。");
      password.current.reportValidity();
      return;
    }

    try {
      const res = await axios.get(`/auth?username=${username.current.value}`);
      if (!res.data.length) {
        username.current.setCustomValidity("そのユーザー名は存在しません。");
        username.current.reportValidity();
        return;
      }
    } catch (err) {
      console.log(err);
      navigate("/error", { state: { message: "予期しないエラーが発生しました。もう一度お試しください。" } });
    }

    try {
      const user = {
        username: username.current.value,
        password: password.current.value
      };
      const res = await axios.post("auth/login", user);
      setUser(res.data);
    } catch (err) {
      password.current.setCustomValidity("パスワードが違います。");
      password.current.reportValidity();
      return;
    }

    try {
      await loginCall(user, dispatch);
      window.location.reload();
    } catch (err) {
      console.log(err);
      navigate("/error", { state: { message: "予期しないエラーが発生しました。もう一度お試しください。" } });
    }
  };


  
  return (
    <div className='Login'>
      <div className="LoginContainer">
        <div className="LoginLeft">
          <div className="LoginLeftContainer">
            <h1 className='LoginLeftTitle'>Mini Diary</h1>
            <div className="LoginLeftDesc">日々を記録し、自分を見つける喜びを</div>
          </div>
        </div>
        <div className="LoginLight">
            <form className='LoginLightForm' action="" onSubmit={handleLogin}>
              <h4 className='LoginLightTop'>ログインはこちら</h4>
              <input className='LoginLightEmail' type="text" placeholder='ユーザー名' required ref={username} onInput={()=> username.current.setCustomValidity("")}/>
              <input className='LoginLightPassword' type="password" placeholder='パスワード' ref={password} onInput={()=> password.current.setCustomValidity("")}/>
              <button className='LoginLightLogin' type='submit'>ログイン</button>
              <Link to="/register" className='LoginLightNew'>
                <button className='LoginLightNewButton' type="button">アカウント作成</button>
              </Link>
            </form>
        </div>
      </div>
    </div>
  )
}
