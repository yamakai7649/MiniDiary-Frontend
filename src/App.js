import { useEffect, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import Spinner from "./components/Spinner/Spinner";
import { fetchSessionUser } from "./store/modules/AuthReducer";
import Error from "./pages/error/Error";
import Home from "./pages/home/Home";
import LandingPage from "./pages/landingPage/LandingPage";
import Login from "./pages/login/Login";
import Notification from "./pages/notification/Notification";
import Profile from "./pages/profile/Profile";
import Register from "./pages/register/Register";
import Search from "./pages/search/Search";

const routerFuture = {
  v7_startTransition: true,
  v7_relativeSplatPath: true,
};

const loadingContainerStyle = {
  width: "100vw",
  height: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

function RequireAuth({ user, children }) {
  return user ? children : <Navigate to="/login" />;
}

function RedirectIfLoggedIn({ user, children }) {
  return user ? <Navigate to="/" /> : children;
}

function App() {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const user = useSelector((state) => state.AuthReducer.user);

  useEffect(() => {
    dispatch(fetchSessionUser()).finally(() => {
      setIsLoading(false);
    });
  }, [dispatch]);

  if (isLoading) {
    return (
      <div style={loadingContainerStyle}>
        <Spinner />
      </div>
    );
  }

  return (
    <div className="App">
      <BrowserRouter future={routerFuture}>
        <Routes>
          <Route
            path="/home"
            element={
              <RedirectIfLoggedIn user={user}>
                <LandingPage />
              </RedirectIfLoggedIn>
            }
          />
          <Route path="/" element={user ? <Home /> : <LandingPage />} />
          <Route
            path="/login"
            element={
              <RedirectIfLoggedIn user={user}>
                <Login />
              </RedirectIfLoggedIn>
            }
          />
          <Route
            path="/register"
            element={
              <RedirectIfLoggedIn user={user}>
                <Register />
              </RedirectIfLoggedIn>
            }
          />
          <Route
            path="/profile/:username"
            element={
              <RequireAuth user={user}>
                <Profile />
              </RequireAuth>
            }
          />
          <Route
            path="/comment/:postId"
            element={
              <RequireAuth user={user}>
                <Home comment />
              </RequireAuth>
            }
          />
          <Route
            path="/profile/:username/comment/:postId"
            element={
              <RequireAuth user={user}>
                <Profile comment />
              </RequireAuth>
            }
          />
          <Route
            path="/notification"
            element={
              <RequireAuth user={user}>
                <Notification />
              </RequireAuth>
            }
          />
          <Route
            path="/search"
            element={
              <RequireAuth user={user}>
                <Search />
              </RequireAuth>
            }
          />
          <Route path="/error" element={<Error />} />
          <Route path="*" element={<Error noPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
