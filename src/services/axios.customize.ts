import axios from "axios";
import { authService } from "./auth.service";

const instance = axios.create({
  // baseURL: import.meta.env.VITE_BACKEND_URL
  baseURL: "http://localhost:8080",
  withCredentials: true, // cho phép nhận cookie
});

instance.interceptors.request.use(
  function (config) {
    const token = localStorage.getItem("access_token");
    const auth = token ? `Bearer ${token}` : "";
    config.headers["Authorization"] = auth;
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

// Add a response interceptor
instance.interceptors.response.use(
  function (response) {
    //    NProgress.done();

    // 200 - 299
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    if (response.data && response.data.data) {
      return response.data;
    }
    return response;
  },
  function (error) {
    //   NProgress.done();

    // Xử lý lỗi 401 (Unauthorized)
    if (error.response?.status === 401) {
      console.log("Received 401 error, forcing logout...");

      // Kiểm tra xem có phải lỗi từ backend không
      const errorData = error.response.data;

      // Nếu có token trong localStorage nhưng vẫn bị 401, có thể là:
      // 1. Token hết hạn
      // 2. Token không hợp lệ
      // 3. Single session - user đã đăng nhập ở nơi khác
      if (authService.hasValidToken()) {
        // Xác định lý do logout dựa trên response từ backend
        let logoutReason:
          | "single_session"
          | "session_expired"
          | "unauthorized" = "unauthorized";

        if (
          errorData?.message?.includes("single session") ||
          errorData?.message?.includes("already logged in") ||
          errorData?.message?.includes("session expired")
        ) {
          logoutReason = "single_session";
        } else if (
          errorData?.message?.includes("token expired") ||
          errorData?.message?.includes("expired")
        ) {
          logoutReason = "session_expired";
        }

        // Thực hiện force logout
        authService.forceLogout(logoutReason);

        // Redirect về trang login sau một chút delay
        setTimeout(() => {
          window.location.href = "/login";
        }, 1500);
      }
    }

    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    if (error.response && error.response.data) return error.response.data;
    return Promise.reject(error);
  }
);

// alter default after instance has been create
// instance.defaults.headers.commom['Authorization'] = AUTH_TOKEN;

export default instance;
