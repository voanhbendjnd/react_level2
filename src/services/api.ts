import { RxFontRoman } from "react-icons/rx"
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

export const getAllCategoriesAPI = () => {
    const url_backend = `/api/v1/categories`
    return axios.get<IBackendRes<string[]>>(url_backend);
}
export const updateBookAPI = (
    id: number,
    title: string,
    author: string,
    price: number,
    categories: string[],
    publisher: string,
    isbn: string,
    description: string,
    language: string,
    stockQuantity: number,
    numberOfPages: number,
    publicationDate: string,
) => {
    const url_backend = `/api/v1/books`
   
    return axios.put<IBackendRes<IBooksTable>>(url_backend, {
        id, title, author, categories, price, publisher, isbn, description, language, stockQuantity, numberOfPages, publicationDate
    })
    
}

export const uploadFileBook = (
    id : number,
    coverImage: File,
    imgs : File[]
) => {
    const url_backend = `/api/v1/files/upload/image/book`;

    const form = new FormData();
    form.append("id", (String)(id));
       // Thêm file ảnh bìa
    form.append("coverImage", coverImage);

    // Duyệt qua mảng imgs và thêm từng file một
    imgs.forEach(file => {
        form.append("imgs", file);
    });

    return axios.post<IBackendRes<IBooksTable>>(url_backend, form, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    
}
// API upload cover image
export const uploadBookCoverImage = (
    id: number,
    coverImage: File
) => {
    const url_backend = `/api/v1/files/upload/cover-image/book`;
    
    const form = new FormData();
    form.append("id", String(id));
    form.append("coverImage", coverImage);
    
    return axios.post<IBackendRes<IBooksTable>>(url_backend, form, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};

// API upload slider images
export const uploadBookSliderImages = (
    id: number,
    imgs: File[]
) => {
    const url_backend = `/api/v1/files/upload/slider-images/book`;
    
    const form = new FormData();
    form.append("id", String(id));
    
    imgs.forEach(file => {
        form.append("imgs", file);
    });
    
    return axios.post<IBackendRes<IBooksTable>>(url_backend, form, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};



export const createBookAPI = (
    title: string,
    author: string,
    price: number,
    categories: string[],
    publisher: string,
    isbn: string,
    description: string,
    language: string,
    stockQuantity: number,
    numberOfPages: number,
    coverImage: File,
    imgs: File[],
    publicationDate: string,
) => {
    const url_backend = `/api/v1/books`;
    const form = new FormData();

    // Thêm các trường dữ liệu
    form.append("title", title);
    form.append("author", author);
    form.append("publisher", publisher);
    form.append("isbn", isbn);
    form.append("language", language);
    form.append("description", description);

    // Chuyển đổi số thành chuỗi
    form.append("price", String(price));
    form.append("stockQuantity", String(stockQuantity));
    form.append("numberOfPages", String(numberOfPages));
    form.append("publicationDate", publicationDate)

    // Duyệt qua mảng categories và thêm từng phần tử một
    categories.forEach(category => {
        form.append("categories", category);
    });

    // Thêm file ảnh bìa
    form.append("coverImage", coverImage);

    // Duyệt qua mảng imgs và thêm từng file một
    imgs.forEach(file => {
        form.append("imgs", file);
    });

    return axios.post<IBackendRes<IBooksTable>>(url_backend, form, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};
