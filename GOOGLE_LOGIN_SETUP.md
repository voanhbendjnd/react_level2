# Hướng dẫn cấu hình Google OAuth2 Login cho Frontend

## Tổng quan

Chức năng đăng nhập Google đã được tích hợp vào form login của ứng dụng React. Người dùng có thể đăng nhập bằng tài khoản Google thay vì nhập email/password thông thường.

## Các file đã được cập nhật

### 1. API Service (`src/services/api.ts`)

- Thêm function `getGoogleLoginUrlAPI()` để lấy URL đăng nhập Google từ backend

### 2. Login Page (`src/pages/client/auth/login.tsx`)

- Thêm import `getGoogleLoginUrlAPI`
- Thêm function `handleGoogleLogin()` để xử lý đăng nhập Google
- Thêm nút "Đăng nhập với Google" với icon Google chính thức
- Thêm divider "Hoặc" để phân tách giữa form đăng nhập thông thường và Google

### 3. Google Callback Page (`src/pages/client/auth/google-callback.tsx`)

- Tạo component mới để xử lý callback từ Google OAuth
- Xử lý các tham số URL để lấy thông tin user và token
- Cập nhật state authentication và redirect về trang chủ

### 4. Routing (`src/main.tsx`)

- Thêm route `/login/oauth2/code/google` cho Google callback
- Import `GoogleCallbackPage` component

### 5. Styling (`src/styles/global.scss`)

- Thêm CSS styling cho nút Google login
- Hiệu ứng hover, focus và active states
- Responsive design

## Cách hoạt động

1. **Người dùng click "Đăng nhập với Google"**

   - Frontend thử gọi API `GET /api/v1/auth/google/login` trước
   - Nếu API không hoạt động, sử dụng URL trực tiếp: `http://localhost:8080/oauth2/authorization/google`
   - Frontend redirect người dùng đến Google OAuth

2. **Google xử lý đăng nhập**

   - Người dùng đăng nhập trên Google
   - Google redirect về `/login/oauth2/code/google` với thông tin user

3. **Backend xử lý callback**

   - Spring Security tự động xử lý OAuth2 callback
   - Backend redirect về frontend với thông tin user và token

4. **Frontend xử lý kết quả**
   - `GoogleCallbackPage` nhận thông tin từ URL parameters hoặc session
   - Nếu không có thông tin rõ ràng, gọi API `/api/v1/auth/account` để kiểm tra
   - Cập nhật authentication state
   - Lưu token vào localStorage
   - Redirect về trang chủ

## Yêu cầu Backend

Backend cần được cấu hình theo hướng dẫn đã cung cấp:

1. **Google OAuth2 Credentials** trong Google Cloud Console
2. **Spring Security OAuth2** configuration
3. **Database schema** với các trường `provider` và `provider_id`
4. **API endpoints**:
   - `GET /api/v1/auth/google/login` - Lấy URL đăng nhập Google
   - `GET /login/oauth2/code/google` - Xử lý callback (tự động)

## Cấu hình Backend cần thiết

### application.properties

```properties
# Google OAuth2 Configuration
spring.security.oauth2.client.registration.google.client-id=YOUR_GOOGLE_CLIENT_ID
spring.security.oauth2.client.registration.google.client-secret=YOUR_GOOGLE_CLIENT_SECRET
spring.security.oauth2.client.registration.google.scope=openid,profile,email
spring.security.oauth2.client.registration.google.redirect-uri=http://localhost:8080/login/oauth2/code/google

spring.security.oauth2.client.provider.google.authorization-uri=https://accounts.google.com/o/oauth2/auth
spring.security.oauth2.client.provider.google.token-uri=https://oauth2.googleapis.com/token
spring.security.oauth2.client.provider.google.user-info-uri=https://www.googleapis.com/oauth2/v2/userinfo
spring.security.oauth2.client.provider.google.user-name-attribute=id
```

### Success Handler Configuration

Backend cần redirect về frontend với thông tin user và token:

```
http://localhost:3000/login/oauth2/code/google?success=true&token=ACCESS_TOKEN&user=USER_INFO_JSON
```

## Testing

### 1. Test Backend API

```bash
# Test API endpoint
curl http://localhost:8080/api/v1/auth/google/login

# Hoặc sử dụng test script
node test-google-login-api.js
```

### 2. Test Frontend Integration

1. Khởi động backend với cấu hình OAuth2
2. Khởi động frontend: `npm run dev`
3. Truy cập `/login`
4. Click "Đăng nhập với Google"
5. Kiểm tra console logs để xem URL được sử dụng
6. Kiểm tra flow đăng nhập hoàn chỉnh

### 3. Expected Behavior

- Click "Đăng nhập với Google" → Gọi API `/api/v1/auth/google/login`
- API trả về: `{"success": true, "data": {"url": "http://localhost:8080/oauth2/authorization/google"}}`
- Frontend redirect đến Google OAuth
- Google redirect về `/login/oauth2/code/google`
- Backend xử lý và redirect về frontend với user info

## Troubleshooting

### Lỗi 404 Not Found khi click "Đăng nhập với Google"

**Nguyên nhân**: Backend chưa được cấu hình OAuth2 hoặc API endpoint không hoạt động.

**Giải pháp**:

1. Kiểm tra backend có chạy trên `http://localhost:8080`
2. Kiểm tra Spring Security OAuth2 configuration
3. Đảm bảo endpoint `/oauth2/authorization/google` được cấu hình
4. Kiểm tra Google OAuth2 credentials trong `application.properties`

### Lỗi CORS khi gọi API

**Nguyên nhân**: Backend chưa cấu hình CORS cho frontend.

**Giải pháp**: Thêm CORS configuration trong Spring Boot:

```java
@CrossOrigin(origins = "http://localhost:3000")
```

### Callback không hoạt động

**Nguyên nhân**: URL callback không đúng hoặc backend chưa xử lý.

**Giải pháp**:

1. Kiểm tra redirect URI trong Google Cloud Console: `http://localhost:8080/login/oauth2/code/google`
2. Đảm bảo Spring Security success handler redirect về frontend
3. Kiểm tra console logs để debug

## Lưu ý

- Đảm bảo CORS được cấu hình đúng cho frontend URL
- Kiểm tra redirect URLs trong Google Cloud Console
- Test trên cả development và production environments
- Xử lý các trường hợp lỗi (network, invalid credentials, etc.)
- Frontend sẽ tự động fallback sang URL trực tiếp nếu API không hoạt động
