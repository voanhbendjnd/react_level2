import { useEffect } from "react";
import { authService, AUTH_EVENTS } from "@/services/auth.service";

/**
 * Hook để lắng nghe các sự kiện authentication
 * @param onForceLogout - Callback khi bị force logout
 * @param onSessionExpired - Callback khi session hết hạn
 */
export const useAuthEvents = (
  onForceLogout?: (reason?: string) => void,
  onSessionExpired?: () => void
) => {
  useEffect(() => {
    const handleForceLogout = (event: CustomEvent) => {
      const reason = event.detail?.reason;
      console.log("Auth event received:", reason);

      if (reason === "single_session" || reason === "session_expired") {
        onSessionExpired?.();
      }

      onForceLogout?.(reason);
    };

    // Lắng nghe custom event
    window.addEventListener(
      AUTH_EVENTS.FORCE_LOGOUT,
      handleForceLogout as EventListener
    );

    // Cleanup
    return () => {
      window.removeEventListener(
        AUTH_EVENTS.FORCE_LOGOUT,
        handleForceLogout as EventListener
      );
    };
  }, [onForceLogout, onSessionExpired]);
};

/**
 * Hook để kiểm tra và xử lý authentication state
 */
export const useAuthState = () => {
  const checkAuthState = () => {
    const token = localStorage.getItem("access_token");
    return {
      hasToken: !!token,
      token: token,
    };
  };

  const clearAuthData = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user_data");
  };

  return {
    checkAuthState,
    clearAuthData,
  };
};
