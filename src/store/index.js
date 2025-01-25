import { configureStore } from "@reduxjs/toolkit";
import reducer from "./modules/AuthReducer";

const store = configureStore({
    reducer: {
        AuthReducer: reducer
    }
});

export default store;