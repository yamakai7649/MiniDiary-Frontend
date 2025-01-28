import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchSessionUser = createAsyncThunk(
    "auth/user",
    async (_, ThunkAPI) => {
        try {
            const res = await axios.get("/auth/user",{ withCredentials: true });
            //console.log(res);
            if (!res) return null;
            return res.data;
        } catch (err) {
            return ThunkAPI.rejectWithValue(err.res.data);
        }
});

const AuthReducer = createSlice({
    name: "AuthReducer",
    initialState: {
        user: null,
        isFetching: false,
        error: false
    },
    reducers: {
        loginStart(state, { type }) {
            state.user = null;
            state.isFetching = true;
            state.error = false;
        },
        loginSuccess(state, { type, payload }) {
            state.user = payload;
            state.isFetching = false;
            state.error = false;
        },
        loginError(state, { type, payload }) {
            state.user = null;
            state.isFetching = false;
            state.error = payload;
        },
        logoutSuccess(state, { payload }) {
            state.user = null;
            state.isFetching = false;
            state.error = false;
        },
        logoutError(state, { type, payload }) {
            state.user = state.user;
            state.isFetching = false;
            state.error = payload;
        },
        followSuccess(state, { payload }) {
            state.user = payload;
            state.isFetching = false;
            state.error = false;
        },
        followError(state, { payload }) {
            state.user = state.user;
            state.isFetching = false;
            state.error = payload;
        },
        unfollowSuccess(state, { payload }) {
            state.user = payload;
            state.isFetching = false;
            state.error = false;
        },
        unfollowError(state, { payload }) {
            state.user = state.user;
            state.isFetching = false;
            state.error = payload;
        },
        editSuccess(state,{payload}) {
            state.user = payload;
            state.isFetching = false;
            state.error = false;
        },
        editError(state,{payload}) {
            state.user = state.user;
            state.isFetching = false;
            state.error = payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchSessionUser.pending, (state) => {
                state.isFetching = true;
                state.error = false;
            })
            .addCase(fetchSessionUser.fulfilled, (state, action) => {
                state.isFetching = false;
                state.error = false;
                state.user = action.payload;
            })
            .addCase(fetchSessionUser.rejected, (state) => {
                state.isFetching = false;
                state.error = true;
            });
    }
});

export const { loginSuccess, loginStart, loginError, logoutSuccess, logoutError,followSuccess,followError,unfollowSuccess,unfollowError,editSuccess,editError } = AuthReducer.actions;

export default AuthReducer.reducer;