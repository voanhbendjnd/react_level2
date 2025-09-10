import React, { createContext, useContext, useState } from "react";

// * Nơi lưu trữ thông tin người dùng từ ge Account
//
//
interface IAppContext {
    isAuthenticated: boolean; // check người dùng đăng nhập chưa
    user: IUser | null;
    setIsAuthenticated: (v: boolean) => void;
    setUser: (v: IUser) => void;
    isAppLoading: boolean;
    setIsAppLoading: (v: boolean) => void;

}

const CurrentAppContext = createContext<IAppContext | null>(null);
type TProps = {
    children: React.ReactNode
}
export const AppProvider = (props: TProps) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [user, setUser] = useState<IUser | null>(null);
    const [isAppLoading, setIsAppLoading] = useState<boolean>(false);

    return (
        <CurrentAppContext.Provider value={{
            isAuthenticated, user, setIsAuthenticated, setUser, setIsAppLoading, isAppLoading
        }}>
            {props.children}
        </CurrentAppContext.Provider>
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
