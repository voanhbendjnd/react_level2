import { fetchAccountAPI } from "@/services/api";
import React, { createContext, useContext, useEffect, useState } from "react";
import AppHeader from "../layout/app.header";
import { Outlet } from "react-router-dom";
import { ClimbingBoxLoader } from "react-spinners";

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
    // get account 
    useEffect(() => {
        const fetchAccount = async () => {
            setIsAppLoading(true);
            const res = await fetchAccountAPI();
            const carts = localStorage.getItem("carts");
            if (res.data) {
                setUser(res.data.user)
                setIsAuthenticated(true);
                if (carts) {
                    setCarts(JSON.parse(carts));
                }
            }
            setIsAppLoading(false)
        }
        fetchAccount();
    }, [])
    return (
        <>
            {!isAppLoading ?
                <CurrentAppContext.Provider
                    value={{
                        isAuthenticated, user, isAppLoading, setIsAppLoading, setUser, setIsAuthenticated, carts, setCarts
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
