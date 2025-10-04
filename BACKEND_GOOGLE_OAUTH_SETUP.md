# Hướng dẫn cấu hình Backend cho Google OAuth2 Login

## Tổng quan

Backend cần được cấu hình để hỗ trợ Google OAuth2 login và tích hợp với frontend React. Dưới đây là hướng dẫn chi tiết từng bước.

## 1. Dependencies cần thiết

### Maven (pom.xml)

```xml
<dependencies>
    <!-- Spring Boot Starter Web -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>

    <!-- Spring Security -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-security</artifactId>
    </dependency>

    <!-- Spring Security OAuth2 Client -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-oauth2-client</artifactId>
    </dependency>

    <!-- Spring Boot Starter Data JPA -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-data-jpa</artifactId>
    </dependency>

    <!-- Database Driver (MySQL/PostgreSQL) -->
    <dependency>
        <groupId>mysql</groupId>
        <artifactId>mysql-connector-java</artifactId>
        <scope>runtime</scope>
    </dependency>

    <!-- JWT (nếu sử dụng) -->
    <dependency>
        <groupId>io.jsonwebtoken</groupId>
        <artifactId>jjwt-api</artifactId>
        <version>0.11.5</version>
    </dependency>
    <dependency>
        <groupId>io.jsonwebtoken</groupId>
        <artifactId>jjwt-impl</artifactId>
        <version>0.11.5</version>
        <scope>runtime</scope>
    </dependency>
    <dependency>
        <groupId>io.jsonwebtoken</groupId>
        <artifactId>jjwt-jackson</artifactId>
        <version>0.11.5</version>
        <scope>runtime</scope>
    </dependency>
</dependencies>
```

## 2. Cấu hình application.properties

```properties
# Server Configuration
server.port=8080

# Database Configuration
spring.datasource.url=jdbc:mysql://localhost:3306/your_database?useSSL=false&serverTimezone=UTC
spring.datasource.username=your_username
spring.datasource.password=your_password
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# JPA Configuration
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQL8Dialect

# Google OAuth2 Configuration
spring.security.oauth2.client.registration.google.client-id=YOUR_GOOGLE_CLIENT_ID
spring.security.oauth2.client.registration.google.client-secret=YOUR_GOOGLE_CLIENT_SECRET
spring.security.oauth2.client.registration.google.scope=openid,profile,email
spring.security.oauth2.client.registration.google.redirect-uri=http://localhost:8080/login/oauth2/code/google

spring.security.oauth2.client.provider.google.authorization-uri=https://accounts.google.com/o/oauth2/auth
spring.security.oauth2.client.provider.google.token-uri=https://oauth2.googleapis.com/token
spring.security.oauth2.client.provider.google.user-info-uri=https://www.googleapis.com/oauth2/v2/userinfo
spring.security.oauth2.client.provider.google.user-name-attribute=id

# CORS Configuration
cors.allowed.origins=http://localhost:3000
cors.allowed.methods=GET,POST,PUT,DELETE,OPTIONS
cors.allowed.headers=*
cors.allow.credentials=true

# JWT Configuration (nếu sử dụng)
jwt.secret=your-secret-key-here
jwt.expiration=86400000
```

## 3. Cập nhật Database Schema

### User Entity với OAuth2 support

```java
@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String email;

    private String name;
    private String phone;
    private String address;
    private String gender;
    private String avatar;

    // OAuth2 fields
    @Column(name = "provider")
    private String provider; // "google", "facebook", "local", etc.

    @Column(name = "provider_id")
    private String providerId; // ID từ OAuth2 provider

    @Enumerated(EnumType.STRING)
    private Role role = Role.USER;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    // Constructors, getters, setters...
}

public enum Role {
    USER, ADMIN, SUPER_ADMIN
}
```

## 4. Security Configuration

```java
@Configuration
@EnableWebSecurity
@EnableGlobalMethodSecurity(prePostEnabled = true)
public class SecurityConfig {

    @Autowired
    private CustomOAuth2UserService customOAuth2UserService;

    @Autowired
    private OAuth2LoginSuccessHandler oAuth2LoginSuccessHandler;

    @Autowired
    private OAuth2LoginFailureHandler oAuth2LoginFailureHandler;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(csrf -> csrf.disable())
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/v1/auth/**").permitAll()
                .requestMatchers("/login/oauth2/code/**").permitAll()
                .requestMatchers("/oauth2/authorization/**").permitAll()
                .requestMatchers("/api/v1/books/**").permitAll()
                .requestMatchers("/api/v1/categories/**").permitAll()
                .anyRequest().authenticated()
            )
            .oauth2Login(oauth2 -> oauth2
                .userInfoEndpoint(userInfo -> userInfo
                    .userService(customOAuth2UserService)
                )
                .successHandler(oAuth2LoginSuccessHandler)
                .failureHandler(oAuth2LoginFailureHandler)
            )
            .addFilterBefore(jwtAuthenticationFilter(), UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOriginPatterns(Arrays.asList("http://localhost:3000"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    // JWT Filter bean...
}
```

## 5. OAuth2 User Service

```java
@Service
public class CustomOAuth2UserService implements OAuth2UserService<OAuth2UserRequest, OAuth2User> {

    @Autowired
    private UserRepository userRepository;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2UserService<OAuth2UserRequest, OAuth2User> delegate = new DefaultOAuth2UserService();
        OAuth2User oAuth2User = delegate.loadUser(userRequest);

        String registrationId = userRequest.getClientRegistration().getRegistrationId();
        String userNameAttributeName = userRequest.getClientRegistration()
            .getProviderDetails().getUserInfoEndpoint().getUserNameAttributeName();

        OAuth2UserInfo oAuth2UserInfo = OAuth2UserInfoFactory.getOAuth2UserInfo(registrationId, oAuth2User.getAttributes());

        if (oAuth2UserInfo.getEmail().isEmpty()) {
            throw new OAuth2AuthenticationException("Email not found from OAuth2 provider");
        }

        User user = userRepository.findByEmail(oAuth2UserInfo.getEmail())
            .orElseGet(() -> {
                User newUser = new User();
                newUser.setEmail(oAuth2UserInfo.getEmail());
                newUser.setName(oAuth2UserInfo.getName());
                newUser.setProvider(registrationId);
                newUser.setProviderId(oAuth2UserInfo.getId());
                newUser.setRole(Role.USER);
                return userRepository.save(newUser);
            });

        return new CustomOAuth2User(oAuth2User.getAttributes(), oAuth2UserInfo, user);
    }
}
```

## 6. OAuth2 Success Handler

```java
@Component
public class OAuth2LoginSuccessHandler implements AuthenticationSuccessHandler {

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                      Authentication authentication) throws IOException {

        CustomOAuth2User oAuth2User = (CustomOAuth2User) authentication.getPrincipal();
        User user = oAuth2User.getUser();

        // Tạo JWT token
        String token = jwtTokenProvider.generateToken(user.getEmail());

        // Tạo response data
        Map<String, Object> responseData = new HashMap<>();
        responseData.put("success", true);
        responseData.put("token", token);
        responseData.put("user", Map.of(
            "id", user.getId(),
            "email", user.getEmail(),
            "name", user.getName(),
            "role", user.getRole().name()
        ));

        // Redirect về frontend với thông tin
        String redirectUrl = String.format(
            "http://localhost:3000/login/oauth2/code/google?success=true&token=%s&user=%s",
            token,
            URLEncoder.encode(new ObjectMapper().writeValueAsString(responseData.get("user")), "UTF-8")
        );

        response.sendRedirect(redirectUrl);
    }
}
```

## 7. OAuth2 Failure Handler

```java
@Component
public class OAuth2LoginFailureHandler implements AuthenticationFailureHandler {

    @Override
    public void onAuthenticationFailure(HttpServletRequest request, HttpServletResponse response,
                                      AuthenticationException exception) throws IOException {

        String redirectUrl = String.format(
            "http://localhost:3000/login/oauth2/code/google?error=%s",
            URLEncoder.encode(exception.getMessage(), "UTF-8")
        );

        response.sendRedirect(redirectUrl);
    }
}
```

## 8. API Endpoints cần thiết

### Auth Controller

```java
@RestController
@RequestMapping("/api/v1/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    // API để lấy Google OAuth URL - BẮT BUỘC cho frontend
    @GetMapping("/google/login")
    public ResponseEntity<Map<String, Object>> getGoogleLoginUrl() {
        try {
            String url = "http://localhost:8080/oauth2/authorization/google";
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", Map.of("url", url));
            response.put("message", "Google OAuth URL retrieved successfully");

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Failed to get Google OAuth URL");
            errorResponse.put("error", e.getMessage());

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    // API để lấy thông tin user hiện tại
    @GetMapping("/account")
    public ResponseEntity<Map<String, Object>> getCurrentUser(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        CustomOAuth2User oAuth2User = (CustomOAuth2User) authentication.getPrincipal();
        User user = oAuth2User.getUser();

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("data", Map.of(
            "id", user.getId(),
            "email", user.getEmail(),
            "name", user.getName(),
            "role", user.getRole().name(),
            "provider", user.getProvider()
        ));

        return ResponseEntity.ok(response);
    }

    // Các API khác (login, register, logout...)
}
```

## 9. JWT Token Provider (nếu sử dụng)

```java
@Component
public class JwtTokenProvider {

    @Value("${jwt.secret}")
    private String jwtSecret;

    @Value("${jwt.expiration}")
    private int jwtExpiration;

    public String generateToken(String email) {
        return Jwts.builder()
            .setSubject(email)
            .setIssuedAt(new Date())
            .setExpiration(new Date(System.currentTimeMillis() + jwtExpiration))
            .signWith(SignatureAlgorithm.HS512, jwtSecret)
            .compact();
    }

    public boolean validateToken(String token) {
        try {
            Jwts.parser().setSigningKey(jwtSecret).parseClaimsJws(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    public String getEmailFromToken(String token) {
        Claims claims = Jwts.parser().setSigningKey(jwtSecret).parseClaimsJws(token).getBody();
        return claims.getSubject();
    }
}
```

## 10. OAuth2UserInfo Factory

```java
public class OAuth2UserInfoFactory {

    public static OAuth2UserInfo getOAuth2UserInfo(String registrationId, Map<String, Object> attributes) {
        if (registrationId.equalsIgnoreCase("google")) {
            return new GoogleOAuth2UserInfo(attributes);
        } else {
            throw new OAuth2AuthenticationException("Sorry! Login with " + registrationId + " is not supported yet.");
        }
    }
}

public class GoogleOAuth2UserInfo extends OAuth2UserInfo {

    public GoogleOAuth2UserInfo(Map<String, Object> attributes) {
        super(attributes);
    }

    @Override
    public String getId() {
        return (String) attributes.get("sub");
    }

    @Override
    public String getName() {
        return (String) attributes.get("name");
    }

    @Override
    public String getEmail() {
        return (String) attributes.get("email");
    }

    @Override
    public String getImageUrl() {
        return (String) attributes.get("picture");
    }
}
```

## 11. Custom OAuth2User

```java
public class CustomOAuth2User implements OAuth2User {

    private OAuth2User oAuth2User;
    private OAuth2UserInfo oAuth2UserInfo;
    private User user;

    public CustomOAuth2User(OAuth2User oAuth2User, OAuth2UserInfo oAuth2UserInfo, User user) {
        this.oAuth2User = oAuth2User;
        this.oAuth2UserInfo = oAuth2UserInfo;
        this.user = user;
    }

    @Override
    public Map<String, Object> getAttributes() {
        return oAuth2User.getAttributes();
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + user.getRole().name()));
    }

    @Override
    public String getName() {
        return oAuth2UserInfo.getName();
    }

    public User getUser() {
        return user;
    }
}
```

## 12. Testing

### Test OAuth2 Flow

1. Khởi động backend
2. Truy cập: `http://localhost:8080/oauth2/authorization/google`
3. Kiểm tra redirect đến Google
4. Sau khi đăng nhập, kiểm tra callback về frontend

### Test API Endpoints

```bash
# Test Google login URL API
curl http://localhost:8080/api/v1/auth/google/login

# Test current user API (cần authentication)
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" http://localhost:8080/api/v1/auth/account
```

## 13. Lưu ý quan trọng

1. **CORS**: Đảm bảo cấu hình CORS cho frontend URL
2. **Session Management**: Sử dụng STATELESS nếu dùng JWT
3. **Error Handling**: Xử lý các trường hợp lỗi OAuth2
4. **Security**: Bảo mật JWT secret key
5. **Database**: Cập nhật schema để hỗ trợ OAuth2 fields
6. **Logging**: Thêm logging để debug OAuth2 flow

## 14. Troubleshooting

### Lỗi thường gặp:

- **404 OAuth2 endpoint**: Kiểm tra Spring Security configuration
- **CORS error**: Cấu hình CORS cho frontend
- **Database error**: Kiểm tra User entity và migration
- **JWT error**: Kiểm tra JWT configuration và secret key

Với cấu hình này, backend sẽ hoạt động hoàn hảo với frontend React Google OAuth2 login!
