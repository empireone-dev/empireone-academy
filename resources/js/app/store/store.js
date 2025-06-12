import appSlice from "@/app/redux/app-slice";
import { configureStore } from "@reduxjs/toolkit";
import examSlice  from "../redux/exam-slice";

const store = configureStore({
    reducer: {
        app: appSlice,
        exams: examSlice,
    },
});

export const RootState = store.getState;
export const AppDispatch = store.dispatch;

export default store;
