import { Outlet } from "react-router-dom"
import AppHeader from "components/layout/app.header"
import AppFooter from "components/layout/app.footer"
import { useState } from "react"

const Layout = () => {
    const [searchItem, setSearchItem] = useState<string>("");
    return (
        <div style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column"
        }}>

            <AppHeader
                searchItem={searchItem}
                setSearchItem={setSearchItem}
            />
            <div style={{ flex: 1 }}>
                <Outlet context={[searchItem, setSearchItem]} />
            </div>
            <AppFooter />
        </div>
    )
}
export default Layout