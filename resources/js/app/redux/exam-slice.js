import { createSlice } from "@reduxjs/toolkit";

export const examSlice = createSlice({
    name: "exam",
    initialState: {
        exams:[]
    },
    reducers: {
        setExams: (state, action) => {
            state.exams = action.payload;
        },
    },
});
export const { setExams } =
    examSlice.actions;

export default examSlice.reducer;
