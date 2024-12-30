import { configureStore } from "@reduxjs/toolkit";
import eduReducer from "../features/slice.js";

const store=configureStore({
    reducer: eduReducer,
})

export default store;