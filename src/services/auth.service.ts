import { message } from "antd";

// Event để thông báo khi user bị logout do single session
export const AUTH_EVENTS = {
  FORCE_LOGOUT: "force_logout",
  SESSION_EXPIRED: "session_expired",
} as const;

// Service để xử lý authentication
export class AuthService {
  private static instance: AuthService;
  private logoutCallbacks: Array<() => void> = [];

  private constructor() {}

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  // Đăng ký callback khi bị logout
  public onLogout(callback: () => void): void {
    this.logoutCallbacks.push(callback);
  }

  // Hủy đăng ký callback
  public offLogout(callback: () => void): void {
    this.logoutCallbacks = this.logoutCallbacks.filter((cb) => cb !== callback);
  }

  // Thực hiện logout và thông báo
  public forceLogout(
    reason:
      | "single_session"
      | "session_expired"
      | "unauthorized" = "unauthorized"
  ): void {
    console.log(`Force logout: ${reason}`);

    // Xóa token
    localStorage.removeItem("access_token");

    // Xóa dữ liệu user khác nếu cần
    localStorage.removeItem("user_data");

    // Thông báo cho user
    if (reason === "single_session") {
      message.warning(
        "Tài khoản đã được đăng nhập ở nơi khác. Vui lòng đăng nhập lại."
      );
    } else if (reason === "session_expired") {
      message.warning("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
    } else {
      message.warning("Phiên đăng nhập không hợp lệ. Vui lòng đăng nhập lại.");
    }

    // Gọi tất cả callback đã đăng ký
    this.logoutCallbacks.forEach((callback) => {
      try {
        callback();
      } catch (error) {
        console.error("Error in logout callback:", error);
      }
    });

    // Dispatch event để các component khác có thể lắng nghe
    window.dispatchEvent(
      new CustomEvent(AUTH_EVENTS.FORCE_LOGOUT, {
        detail: { reason },
      })
    );
  }

  // Kiểm tra token có hợp lệ không
  public hasValidToken(): boolean {
    const token = localStorage.getItem("access_token");
    return !!token;
  }

  // Lấy token hiện tại
  public getToken(): string | null {
    return localStorage.getItem("access_token");
  }

  // Xóa token
  public clearToken(): void {
    localStorage.removeItem("access_token");
  }
}

export const authService = AuthService.getInstance();
