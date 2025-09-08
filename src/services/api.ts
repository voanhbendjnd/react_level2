import axios from "services/axios.customize"

export const loginAPI = (email: string, password: string) => {
    const url_backend = "/api/v1/auth/login"
    const data = {
        email: email,
        password: password
    }
    return  axios.post<IBackendRes<ILogin>>(url_backend, {email, password})
}

export const registerAPI = (name: string, email: string, password: string, confirmPassword: string, phone: string) => {
    const url_backend = "/api/v1/auth/register"
    const data = {
        name: name,
        email: email,
        password: password,
        confirmPassword: confirmPassword,
        phone: phone
    }
    return axios.post<IBackendRes<IRegister>>(url_backend, data);
}