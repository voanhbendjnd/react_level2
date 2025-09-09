import axios from "services/axios.customize"

export const loginAPI = (username: string, password: string) => {
    const url_backend = "/api/v1/auth/login"
    // const data = {
    //     username: username,
    //     password: password,
    // }
    // return axios.post<IBackendRes<ILogin>>(url_backend, data)
    return axios.post<IBackendRes<ILogin>>(url_backend, { username, password }, {
        headers: {
            delay:"1"
        }
    })

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

export const fetchAccountAPI = () => {
    const url_backend = "/api/v1/auth/account";
    return axios.get<IBackendRes<IFetchAccount>>(url_backend, {
        headers: {
            delay:"1"
        }
    })
}