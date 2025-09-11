import { Button, Result } from "antd";
import { useCurrentApp } from "components/context/app.context";
import { Link, useLocation } from "react-router-dom";

interface IProps {
    children: React.ReactNode
}
const ProtectedRoute = (props: IProps) => {
    const location = useLocation();
    const { isAuthenticated, user } = useCurrentApp();
    if (isAuthenticated === false) {
        return (
            <Result
                status="404"
                title="404"
                subTitle="Sorry, the page you visited does not exist."
                extra={<Button type="primary">  <Link to={"/"}>
                    Quay lại trang chủ
                </Link></Button>}
            />
        )
    }
    const isAdminRoute = location.pathname.includes("admin");
    if (isAuthenticated && isAdminRoute) {
        const role = user?.role;
        if (role !== "SUPER_ADMIN") {
            return (
                <Result
                    status="403"
                    title="403"
                    subTitle="Bạn không có quyền truy cập"
                    extra={<Button type="primary">
                        <Link to={"/"}>
                            Quay lại trang chủ
                        </Link>
                    </Button>}
                />
            )
        }
    }
    return (
        <>
            {props.children}

        </>
    )
}
export default ProtectedRoute;