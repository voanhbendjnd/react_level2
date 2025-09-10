import { Outlet } from "react-router-dom"
import AppHeader from "./components/layout/app.header"
import { fetchAccountAPI } from '@/services/api';
import { useEffect } from "react";
import { useCurrentApp } from "./components/context/app.context";
import ClimbingBoxLoader from "react-spinners/ClimbingBoxLoader";

const Layout = () => {
    const { setUser, setIsAuthenticated, isAppLoading, setIsAppLoading } = useCurrentApp();
    useEffect(() => {
        const fetchAccount = async () => {
            setIsAppLoading(true);
            const res = await fetchAccountAPI()
            if (res.data) {
                setUser(res.data.user)
                setIsAuthenticated(true);
            }
            setIsAppLoading(false);
        }
        fetchAccount()
    }, []);
    return (
        <>
            {!isAppLoading ?
                <div>
                    <AppHeader />
                    <Outlet />


                </div> :
                <div
                    style={{
                        position: "fixed",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)"
                    }}>
                    <ClimbingBoxLoader
                        size={30}
                        color="aqua"
                    />
                </div>
            }
        </>

    )
}
export default Layout