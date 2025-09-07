import { configureStore } from "@reduxjs/toolkit";
import baseApiSlice from "./baseApi/baseApiSlice";
import userInfoSlice from "../features/user/userInfoSlice";

const store = configureStore({
    reducer: {
        [baseApiSlice.reducerPath]: baseApiSlice.reducer,
        [userInfoSlice.reducerPath]: userInfoSlice.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(baseApiSlice.middleware),
});

export type AppDispatch = typeof store.dispatch;
export default store;
