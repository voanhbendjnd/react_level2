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
            delay:"1000"
        }
    })
}
export const logoutAPI = () => {
    const url_backend = "/api/v1/auth/logout";
    return axios.post<IBackendRes<IRegister>>(url_backend);
}

export const fetchUsersAPI = (query: string) => {
    const url_backend = `/api/v1/users?${query}`;
    return axios.get <IBackendRes<IModelPaginate<IUsersTable>>>(url_backend);
}
export const fetchBooksAPI = (query: string) => {
    const url_backend = `/api/v1/books?${query}`;
    return axios.get<IBackendRes<IModelPaginate<IBooksTable>>>(url_backend)
}

export const deleteUserAPI = (id: string) => {
    const url_backend = `/api/v1/users/${id}`;
    return axios.delete<IBackendRes<string>>(url_backend);
}

export const createUsersAPI = (users : IRegister[]) => {
    const url_backend = `/api/v1/users/b-create`;

    return axios.post<IBackendRes<IRegister[]>>(url_backend, users);
}

export const createUsersAPIs = (users: {
    name: string;
    password: string;
    email: string;
    phone: string;
}[]) => {
    const url_backend = `/api/v1/users/b-create`;

    return axios.post<IBackendRes<IRegister[]>>(url_backend, users);
}

export const updateUserAPI = (id: string, email: string, name: string, phone: string) => {
    const url_backend = `/api/v1/users`
    return axios.put<IBackendRes<IFetchAccount>>(url_backend, {id, email, name, phone})
}