import { configureStore } from "@reduxjs/toolkit";
import baseApiSlice from "./baseApi/baseApiSlice";

const store = configureStore({
    reducer: {
        [baseApiSlice.reducerPath]: baseApiSlice.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(baseApiSlice.middleware),
});

export type AppDispatch = typeof store.dispatch;
export default store;
