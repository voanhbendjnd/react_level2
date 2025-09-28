import { Outlet } from "react-router-dom"
import AppHeader from "components/layout/app.header"
import AppFooter from "components/layout/app.footer"

const Layout = () => {
    return (
        <div style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column"
        }}>
            <AppHeader />
            <div style={{ flex: 1 }}>
                <Outlet />
            </div>
            <AppFooter />
        </div>
    )
}
export default Layout