import UserTable from "@/components/admin/user/table.user"
import { fetchUsersAPI } from "@/services/api";
import { useEffect, useState } from "react";

const ManageUserPage = () => {
    // const [current, setCurrent] = useState(1);
    // const [pageSize, setPageSize] = useState(5);
    // const [total, setTotal] = useState(0);
    // const [dataUser, setDataUser] = useState<IUsersTable[]>([]);
    // useEffect(() => {
    //     loadUser();
    // }, [current, pageSize])
    // const loadUser = async () => {
    //     const res = await fetchUsersAPI(current, pageSize);
    //     if (res.data) {
    //         setCurrent(res.data.meta.page)
    //         setPageSize(res.data.meta.pageSize)
    //         setTotal(res.data.meta.total)
    //         setDataUser(res.data?.result);
    //     }
    // }
    return (
        <div>
            <UserTable
            />
        </div>
    )
}
export default ManageUserPage;