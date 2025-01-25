import Home from "./pages/home/Home"
import Profile from "./pages/profile/Profile"
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import Notification from "./pages/notification/Notification";
import Search from "./pages/search/Search";
import { BrowserRouter, Routes, Route, Navigate, } from "react-router-dom";
import { useSelector,useDispatch } from "react-redux";
import Error from "./pages/error/Error";
import { fetchSessionUser } from "./store/modules/AuthReducer";
import { useEffect, useState } from "react";
import Spinner from "./components/Spinner/Spinner";
import LandingPage from "./pages/LandingPage/LandingPage";

function App() {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const user = useSelector((state) => {
    return state.AuthReducer.user;
  });

  useEffect(() => {
    const fetchUser = () => {
      try {
        dispatch(fetchSessionUser());
      } catch (err) {
        console.log(err);
      } finally {
        setTimeout(() => {
          setIsLoading(false);
        }, 2000);
      }
    }
    fetchUser();
  }, []);


  if (isLoading) {
    return (
      <>
        <div style={{ width: "100vw" ,height:"100vh", display:"flex", alignItems:"center",justifyContent:"center"}}><Spinner/></div>
      </>
    );
  }


  return (
    <div className="App">
      <BrowserRouter future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true, 
      }}
      >
        <Routes>
          <Route path="/home" element={user ? <Navigate to="/" /> : <LandingPage />} />
          <Route path="/" element={user ? <Home /> : <LandingPage />} />
          <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
          <Route path="/register" element={user ? <Navigate to="/" /> : <Register />} />
          <Route path={`/profile/:username`} element={user && <Profile />} />
          <Route path={`/comment/:postId`} element={user && <Home comment />} />
          <Route path={`/profile/:username/comment/:postId`} element={user && <Profile comment />} />
          <Route path="/notification" element={user && <Notification />} />
          <Route path="/search" element={user && <Search />} />
          <Route path="/error" element={<Error />} />
          <Route path="*" element={<Error noPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );

};

export default App;
