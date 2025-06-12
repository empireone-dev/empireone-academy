import { get_exam_service } from "../services/exam-service";
import { examSlice } from "./exam-slice";

export function get_exams_thunk() {
    return async function (dispatch, getState) {
        const res = await get_exam_service()
           console.log('exams',res.data)
        dispatch(examSlice.actions.setExams(res.data));
    };
}