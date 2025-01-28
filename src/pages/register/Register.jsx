import { useRef,useEffect,useState} from 'react';
import axios from "axios";
import "./Register.css"
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginCall } from "../../actionCalls";

export default function Register() {
  const dispatch = useDispatch();
  const username = useRef();
  const password = useRef();
  const passwordConfirm = useRef();
  const navigate = useNavigate();
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    useEffect(() => {
        window.addEventListener("resize", () => setWindowWidth(window.innerWidth));

        return () => {
            window.removeEventListener("resize", () => setWindowWidth(window.innerWidth));
        };
    }, []);

  const handleRegister = async (e) => {
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

    if (password.current.value !== passwordConfirm.current.value) {
      passwordConfirm.current.setCustomValidity("パスワードが一致しません。");
      passwordConfirm.current.reportValidity();
      return;
    }

    try {
      const res = await axios.get(`/auth?username=${username.current.value}`);
      if (res.data.length) {
        username.current.setCustomValidity("そのユーザー名はすでに使われています。");
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
        password: password.current.value,
      }
      await axios.post("/auth/register", user);
      const res = await axios.post("auth/login", user,{ withCredentials: true });
      await loginCall(res.data, dispatch);
      window.location.reload();
    } catch (err) {
      console.log(err);
      navigate("/error", { state: { message: "予期しないエラーが発生しました。もう一度お試しください。" } });
    }
    
    
  };

  return (
    <div className='Register'>
      <div className="RegisterContainer">
        <div className="RegisterLeft">
          <div className="RegisterLeftContainer">
            <h1 className='RegisterLeftTitle'>Mini Diary</h1>
            <div className="RegisterLeftDesc">日々を記録し、自分を見つける喜びを</div>
          </div>
        </div>
        <div className="RegisterLight" >
            <form className='RegisterLightForm' action="" onSubmit={handleRegister}>
              <h4 className='RegisterLightTop'>新規登録はこちら</h4>
              <input className='RegisterLightUsername' type="text" placeholder='ユーザー名'  ref={username} required onInput={(e) => e.target.setCustomValidity("")} />
              <input className='RegisterLightPassword' type="password" placeholder='パスワード' ref={password} required onInput={(e) => e.target.setCustomValidity("")}/>
              <input className='RegisterLightConfirmPassword' type="password" placeholder='確認用パスワード' required ref={passwordConfirm} onInput={(e) => e.target.setCustomValidity("")}/>        
              <button className='RegisterLightSignup' type="submit">サインアップ</button>
              <Link to="/login" className='RegisterLightLogin'>
                <button className='RegisterLightLoginButton' type="button">ログイン</button>
              </Link>
            </form>
        </div>
      </div>
    </div>
  )
}
