# Google Login - Quick Start Guide

## 🎯 Mục tiêu

Tích hợp đăng nhập Google OAuth2 vào ứng dụng React một cách chuyên nghiệp.

## 🔄 Flow hoạt động

```
Frontend → Backend API → Google OAuth → Backend Callback → Frontend
```

1. **Frontend** click "Đăng nhập với Google"
2. **Frontend** gọi `GET /api/v1/auth/google/login`
3. **Backend** trả về `http://localhost:8080/oauth2/authorization/google`
4. **Frontend** redirect đến Google OAuth
5. **Google** redirect về `/login/oauth2/code/google`
6. **Backend** xử lý callback và redirect về frontend với user info

## 🚀 Cách sử dụng

### Frontend (Đã hoàn thành)

- ✅ Nút "Đăng nhập với Google" với loading state
- ✅ Error handling chuyên nghiệp
- ✅ API integration với backend
- ✅ Callback handling

### Backend (Cần cấu hình)

- ⚠️ Cấu hình Spring Security OAuth2
- ⚠️ Tạo API endpoint `/api/v1/auth/google/login`
- ⚠️ Cấu hình Google OAuth2 credentials
- ⚠️ Xử lý callback và redirect

## 🧪 Test

```bash
# Test backend API
curl http://localhost:8080/api/v1/auth/google/login

# Test với script
node test-google-login-api.js
```

## 📁 Files quan trọng

- `src/pages/client/auth/login.tsx` - Form login với Google button
- `src/pages/client/auth/google-callback.tsx` - Xử lý callback
- `src/services/api.ts` - API functions
- `BACKEND_GOOGLE_OAUTH_SETUP.md` - Hướng dẫn backend chi tiết

## ⚡ Quick Fix

Nếu gặp lỗi 404, kiểm tra:

1. Backend có chạy trên port 8080?
2. API `/api/v1/auth/google/login` có hoạt động?
3. Spring Security OAuth2 có được cấu hình?

## 🎉 Kết quả

Sau khi cấu hình xong, người dùng có thể:

- Click "Đăng nhập với Google"
- Đăng nhập bằng tài khoản Google
- Tự động được redirect về ứng dụng
- Thông tin user được lưu vào state
