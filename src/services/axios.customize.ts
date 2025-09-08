import axios from "axios";

const instance = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL
})

// Add a request interceptor
// instance.interceptors.request.use(function (config) {
// //   NProgress.start(); // loading bar
// if (typeof window !== "undefined" && window && window.localStorage &&
// window.localStorage.getItem('access_token')) {
// config.headers.Authorization = 'Bearer ' + window.localStorage.getItem('access_token');
// }
// // Do something before request is sent
// return config;
// }, function (error) {
// //   NProgress.done();

// // Do something with request error
// return Promise.reject(error);
// });
instance.interceptors.request.use(function (config) {
    return config;
},
    function (error) {
        return Promise.reject(error);
    }
)
// Add a response interceptor
instance.interceptors.response.use(function (response) {
//    NProgress.done();

    // 200 - 299
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    if (response.data && response.data.data) {
        return response.data
    }
    return response;
}, function (error) {
//   NProgress.done();

    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    if(error.response && error.response.data) return error.response.data
    return Promise.reject(error);
  });

// alter default after instance has been create
// instance.defaults.headers.commom['Authorization'] = AUTH_TOKEN;

export default instance