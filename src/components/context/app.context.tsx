import { fetchAccountAPI } from "@/services/api";
import React, { createContext, useContext, useEffect, useState } from "react";
import { ClimbingBoxLoader } from "react-spinners";
import { authService, AUTH_EVENTS } from "@/services/auth.service";

// * Nơi lưu trữ thông tin người dùng từ ge Account
//
//
interface IAppContext {
    isAuthenticated: boolean; // check người dùng đăng nhập chưa
    user: IUser | null;
    setIsAuthenticated: (v: boolean) => void;
    setUser: (v: IUser | null) => void;
    isAppLoading: boolean;
    setIsAppLoading: (v: boolean) => void;
    carts: ICart[];
    setCarts: (v: ICart[]) => void;
    refreshUserData: () => Promise<void>; // Function để refresh user data
}

const CurrentAppContext = createContext<IAppContext | null>(null);
type TProps = {
    children: React.ReactNode
}
export const AppProvider = (props: TProps) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [user, setUser] = useState<IUser | null>(null);
    const [isAppLoading, setIsAppLoading] = useState<boolean>(false);
    const [carts, setCarts] = useState<ICart[]>([]);

    // Function để xử lý logout
    const handleLogout = () => {
        console.log('Handling logout in AppProvider...');
        setIsAuthenticated(false);
        setUser(null);
        // Có thể giữ lại carts hoặc xóa tùy theo yêu cầu business
        // setCarts([]);
    };

    // Function để refresh user data từ backend
    const refreshUserData = async () => {
        try {
            console.log('Refreshing user data...');
            const res = await fetchAccountAPI();
            if (res.data) {
                setUser(res.data.user);
                console.log('User data refreshed successfully:', res.data.user);
            }
        } catch (error) {
            console.error('Error refreshing user data:', error);
            // Không throw error để tránh crash app
        }
    };

    // get account 
    useEffect(() => {
        const fetchAccount = async () => {
            setIsAppLoading(true);
            try {
                const res = await fetchAccountAPI();
                const carts = localStorage.getItem("carts");
                if (res.data) {
                    setUser(res.data.user)
                    setIsAuthenticated(true);
                    if (carts) {
                        setCarts(JSON.parse(carts));
                    }
                }
            } catch (error) {
                console.error('Error fetching account:', error);
                // Nếu fetch account thất bại, có thể token đã hết hạn
                setIsAuthenticated(false);
                setUser(null);
            }
            setIsAppLoading(false)
        }
        fetchAccount();
    }, [])

    // Lắng nghe sự kiện force logout
    useEffect(() => {
        // Đăng ký callback với auth service
        authService.onLogout(handleLogout);

        // Lắng nghe custom event
        const handleForceLogout = (event: CustomEvent) => {
            console.log('Force logout event received:', event.detail);
            handleLogout();
        };

        window.addEventListener(AUTH_EVENTS.FORCE_LOGOUT, handleForceLogout as EventListener);

        // Cleanup
        return () => {
            authService.offLogout(handleLogout);
            window.removeEventListener(AUTH_EVENTS.FORCE_LOGOUT, handleForceLogout as EventListener);
        };
    }, []);
    return (
        <>
            {!isAppLoading ?
                <CurrentAppContext.Provider
                    value={{
                        isAuthenticated, user, isAppLoading, setIsAppLoading, setUser, setIsAuthenticated, carts, setCarts, refreshUserData
                    }}
                >
                    {props.children}
                </CurrentAppContext.Provider>
                :
                <div
                    style={{
                        position: "fixed",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)"
                    }}
                >
                    <ClimbingBoxLoader
                        size={30}
                        color="#ccc"
                    />

                </div>
            }
        </>



    )
}
export const useCurrentApp = () => {
    const currentAppContext = useContext(CurrentAppContext);
    if (!currentAppContext) {
        throw new Error(
            "useCurrentApp has to be used within <CurrentAppContext.Provider>"
        );
    }
    return currentAppContext;
}
