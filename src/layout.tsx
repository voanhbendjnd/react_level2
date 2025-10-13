import { Outlet } from "react-router-dom"
import AppHeader from "components/layout/app.header"
import AppFooter from "components/layout/app.footer"
import AppBottomNav from "components/layout/app.bottom.nav"
import { useState } from "react"
import { Grid } from "antd"
import AuthDebugger from "@/components/debug/AuthDebugger"
import UserDataSyncDemo from "@/components/debug/UserDataSyncDemo"

const Layout = () => {
    const [searchItem, setSearchItem] = useState<string>("");
    const screens = Grid.useBreakpoint();
    const isMobile = !screens?.md;

    return (
        <div style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            paddingBottom: isMobile ? "70px" : "0" // Thêm padding bottom cho mobile để tránh bị che bởi bottom nav
        }}>
            <AppHeader />
            <div style={{ flex: 1 }}>
                <Outlet context={[searchItem, setSearchItem]} />
            </div>
            <AppFooter />

            {/* Bottom Navigation chỉ hiển thị trên mobile */}
            {isMobile && <AppBottomNav />}
            <AuthDebugger />
            <UserDataSyncDemo />
        </div>
    )
}
export default Layout