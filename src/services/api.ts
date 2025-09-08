import axios from "services/axios.customize";
export const loginAPI = (email: string, password: String) => {
   const url_backend = "/api/v1/auth/login"
    return axios.post(url_backend, password);
}