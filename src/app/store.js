import { configureStore } from "@reduxjs/toolkit";
import apiSlice from "../features/api/apiSlice";
import surahSlice from "../features/surah/surahSlice";

const store = configureStore({
    reducer: {
        [apiSlice.reducerPath]: apiSlice.reducer,
        surah: surahSlice,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(apiSlice.middleware),
    // disable devtools for production
    devTools: import.meta.env.PROD ? false : true,
});

export default store;