import axios from "axios";

export function store_exam_service(data) {
    const res = axios.post("/api/exam", data);
    return res;
}


export function get_exam_service() {
    const res = axios.get("/api/exam");
    return res;
}
