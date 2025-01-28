import { loginSuccess, loginError,logoutSuccess,logoutError,followSuccess,followError,unfollowSuccess,unfollowError,editSuccess,editError } from "./store/modules/AuthReducer";
import axios from "axios";

export const loginCall = async (user, dispatch) => {
    try {
        dispatch(loginSuccess(user));
    } catch (err) {
        dispatch(loginError(err));
        console.log(err);
        throw err;
    }
}

export const logoutCall = async(dispatch) => {
    try {
        dispatch(logoutSuccess());
        await axios.post("/auth/logout",{ withCredentials: true });
    } catch (err) {
        dispatch(logoutError(err));
        console.log(err);
        throw err;
    }
}

export const followCall = async(user,dispatch) => {
    try {
        dispatch(followSuccess(user));
    } catch (err) {
        dispatch(followError(err));
        console.log(err);
        throw err;
    }
}

export const unfollowCall = async(user,dispatch) => {
    try {
        dispatch(unfollowSuccess(user));
    } catch (err) {
        dispatch(unfollowError(err));
        console.log(err);
        throw err;
    }
}

export const editCall = async(user,dispatch) => {
    try {
        dispatch(editSuccess(user));
    } catch (err) {
        dispatch(editError(err));
        console.log(err);
        throw err;
    }
}


