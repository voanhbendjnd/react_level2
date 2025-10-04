import axios from "services/axios.customize";

export const loginAPI = (username: string, password: string) => {
  const url_backend = "/api/v1/auth/login";
  // const data = {
  //     username: username,
  //     password: password,
  // }
  // return axios.post<IBackendRes<ILogin>>(url_backend, data)
  return axios.post<IBackendRes<ILogin>>(
    url_backend,
    { username, password },
    {
      headers: {
        delay: "1",
      },
    }
  );
};

export const registerAPI = (
  name: string,
  email: string,
  password: string,
  confirmPassword: string,
  phone: string
) => {
  const url_backend = "/api/v1/auth/register";
  const data = {
    name: name,
    email: email,
    password: password,
    confirmPassword: confirmPassword,
    phone: phone,
  };
  return axios.post<IBackendRes<IRegister>>(url_backend, data);
};

export const fetchAccountAPI = () => {
  const url_backend = "/api/v1/auth/account";
  return axios.get<IBackendRes<IFetchAccount>>(url_backend, {
    headers: {
      delay: "1000",
    },
  });
};
export const logoutAPI = () => {
  const url_backend = "/api/v1/auth/logout";
  return axios.post<IBackendRes<IRegister>>(url_backend);
};

export const fetchUsersAPI = (query: string) => {
  const url_backend = `/api/v1/users?${query}`;
  return axios.get<IBackendRes<IModelPaginate<IUsersTable>>>(url_backend);
};
export const fetchBooksAPI = (query: string) => {
  const url_backend = `/api/v1/books?${query}`;
  return axios.get<IBackendRes<IModelPaginate<IBooksTable>>>(url_backend, {
    headers: {
      delay: "1000",
    },
  });
};

export const deleteUserAPI = (id: string) => {
  const url_backend = `/api/v1/users/${id}`;
  return axios.delete<IBackendRes<string>>(url_backend);
};

export const createUsersAPI = (users: IRegister[]) => {
  const url_backend = `/api/v1/users/b-create`;

  return axios.post<IBackendRes<IRegister[]>>(url_backend, users);
};

export const createUsersAPIs = (
  users: {
    name: string;
    password: string;
    email: string;
    phone: string;
  }[]
) => {
  const url_backend = `/api/v1/users/b-create`;

  return axios.post<IBackendRes<IRegister[]>>(url_backend, users);
};

export const updateUserAPI = (
  id: string,
  email: string,
  name: string,
  phone: string
) => {
  const url_backend = `/api/v1/users`;
  return axios.put<IBackendRes<IFetchAccount>>(url_backend, {
    id,
    email,
    name,
    phone,
  });
};

export const getAllCategoriesAPI = () => {
  const url_backend = `/api/v1/categories`;
  return axios.get<IBackendRes<string[]>>(url_backend);
};
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
  publicationDate: string
) => {
  const url_backend = `/api/v1/books`;

  return axios.put<IBackendRes<IBooksTable>>(url_backend, {
    id,
    title,
    author,
    categories,
    price,
    publisher,
    isbn,
    description,
    language,
    stockQuantity,
    numberOfPages,
    publicationDate,
  });
};

export const uploadFileBook = (id: number, coverImage: File, imgs: File[]) => {
  const url_backend = `/api/v1/files/upload/image/book`;

  const form = new FormData();
  form.append("id", String(id));
  // Thêm file ảnh bìa
  form.append("coverImage", coverImage);

  // Duyệt qua mảng imgs và thêm từng file một
  imgs.forEach((file) => {
    form.append("imgs", file);
  });

  return axios.post<IBackendRes<IBooksTable>>(url_backend, form, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
// API upload cover image
export const uploadBookCoverImage = (id: number, coverImage: File) => {
  const url_backend = `/api/v1/files/upload/cover-image/book`;

  const form = new FormData();
  form.append("id", String(id));
  form.append("coverImage", coverImage);

  return axios.post<IBackendRes<IBooksTable>>(url_backend, form, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
export const uploadAvatar = (id: string, avatar: File) => {
  const url_backend = `/api/v1/files/upload/avatar/user`;
  const form = new FormData();
  form.append("id", id);
  form.append("avatar", avatar);
  return axios.post<IBackendRes<IUser>>(url_backend, form, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
// API upload slider images
export const uploadBookSliderImages = (id: number, imgs: File[]) => {
  const url_backend = `/api/v1/files/upload/slider-images/book`;

  const form = new FormData();
  form.append("id", String(id));

  imgs.forEach((file) => {
    form.append("imgs", file);
  });

  return axios.post<IBackendRes<IBooksTable>>(url_backend, form, {
    headers: {
      "Content-Type": "multipart/form-data",
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
  publicationDate: string
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
  form.append("publicationDate", publicationDate);

  // Duyệt qua mảng categories và thêm từng phần tử một
  categories.forEach((category) => {
    form.append("categories", category);
  });

  // Thêm file ảnh bìa
  form.append("coverImage", coverImage);

  // Duyệt qua mảng imgs và thêm từng file một
  imgs.forEach((file) => {
    form.append("imgs", file);
  });

  return axios.post<IBackendRes<IBooksTable>>(url_backend, form, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const deleteBookAPI = (id: number) => {
  const url_backend = `/api/v1/books/${id}`;
  return axios.delete<IBackendRes<IBooksTable>>(url_backend);
};

export const getBookByIdAPI = (id: any) => {
  const url_backend = `/api/v1/books/${id}`;
  return axios.get<IBackendRes<IBooksTable>>(url_backend, {
    headers: {
      delay: "3000",
    },
  });
};

export const orderAPI = (payload: IRequestOrder) => {
  const url_backend = `/api/v1/orders`;
  return axios.post<IBackendRes<any>>(url_backend, payload, {
    headers: {
      delay: "1000",
    },
  });
};

export const watchingHistoryAPI = (
  page: number = 1,
  size: number = 10,
  status?: string
) => {
  let url_backend = `/api/v1/orders/history?page=${page}&size=${size}`;
  if (status && status !== "all") {
    url_backend += `&status=${status}`;
  }
  return axios.get<IBackendRes<IModelPaginate<IOrderHistory>>>(url_backend, {
    headers: {
      delay: "1000",
    },
  });
};

export const updateCurrentUser = (
  id: string,
  email: string,
  name: string,
  phone: string,
  gender: string,
  address?: string
) => {
  const url_backend = `/api/v1/auth/user/update`;
  return axios.put<IBackendRes<IFetchAccount>>(url_backend, {
    id,
    email,
    name,
    phone,
    gender,
    address,
  });
};
export const changePasswordAPI = (
  oldPassword: string,
  newPassword: string,
  confirmPassword: string
) => {
  const url_backend = `/api/v1/auth/change-password`;
  return axios.put<IBackendRes<IFetchAccount>>(url_backend, {
    oldPassword,
    newPassword,
    confirmPassword,
  });
};

export const forgotPasswordAPI = (email: string) => {
  const url_backend = `/api/v1/auth/forgot-password`;
  return axios.post<IBackendRes<IFetchAccount>>(url_backend, {
    email,
  });
};
export const verifyOtpAPI = (email: string, oneTimePassword: string) => {
  const url_backend = `/api/v1/auth/verify-otp`;
  return axios.post<IBackendRes<IFetchAccount>>(url_backend, {
    email,
    oneTimePassword,
  });
};

export const changePasswordByOtpAPI = (
  email: string,
  newPassword: string,
  confirmPassword: string
) => {
  const url_backend = `/api/v1/auth/change-password-by-otp`;
  return axios.post<IBackendRes<IFetchAccount>>(url_backend, {
    email,
    newPassword,
    confirmPassword,
  });
};

export const countDashboardAPI = () => {
  const url_backend = `/api/v1/dashboard`;
  return axios.get<IBackendRes<ICountDashboard>>(url_backend);
};
export const getAllOrderAPI = (query: string) => {
  const url_backend = `/api/v1/orders?${query}`;
  return axios.get<IBackendRes<IModelPaginate<ITableOrders>>>(url_backend);
};

/**
 * Gọi API Backend để khởi tạo thanh toán VNPAY.
 * Backend sẽ trả về lệnh Redirect URL đến cổng VNPAY.
 * Do endpoint hiện tại ở BE là @GetMapping, FE chỉ cần gọi API GET này
 * và lấy URL chuyển hướng.
 * * Lưu ý: Endpoint này phải được cấu hình 'permitAll()' trong Spring Security
 * nếu nó được gọi bằng window.location.href (không kèm token Authorization)
 * và không được bảo vệ.
 * * Nếu BE yêu cầu token, bạn cần đổi BE sang @PostMapping và dùng axios.post (xem phần dưới).
 * * @param orderId Mã đơn hàng cần thanh toán
 * @returns {Promise<any>} Response chứa dữ liệu, bao gồm cả URL chuyển hướng nếu Backend đã sửa để trả về JSON
 */
export const initiateVnpayPaymentAPI_GET = (orderId: number | string) => {
  // Đường dẫn API hiện tại đang là GET và truyền orderId qua query param
  // Thêm tiền tố '/api' theo cấu hình proxy trong vite.config.ts
  const url_backend = `/api/v1/payment/vnpay/create?orderId=${orderId}`;

  // Sử dụng GET
  return axios.get(url_backend);
};

/**
 * HÀM KHUYẾN NGHỊ (NẾU DÙNG @POST Ở BE):
 * Nếu Backend được sửa thành @PostMapping và yêu cầu Token xác thực
 * thì bạn nên dùng hàm này.
 * * @param orderId Mã đơn hàng cần thanh toán
 * @returns Promise<any> chứa vnpayUrl nếu thành công
 */
export const initiateVnpayPaymentAPI_POST = (orderId: number | string) => {
  // Đường dẫn API POST
  const url_backend = `/api/v1/payment/vnpay/create`;

  const data = {
    orderId: Number(orderId),
  };

  // Sử dụng POST, Axios sẽ tự động thêm Token vào Header (nhờ services/axios.customize.ts)
  return axios.post(url_backend, data);
};
