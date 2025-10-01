import { countDashboardAPI } from "@/services/api";
import { Col, Row, Statistic, type StatisticProps } from "antd";
import { useEffect, useState } from "react";
import CountUp from "react-countup";

const formatter: StatisticProps['formatter'] = (value) => (
    <CountUp end={value as number} />
);
export const DashBoardPage = () => {
    const [countUser, setCountUser] = useState<number>(0);
    const [countBook, setCountBook] = useState<number>(0);
    const [countOrder, setCountOrder] = useState<number>(0);
    useEffect(() => {
        const getCountDashboard = async () => {
            const res = await countDashboardAPI();
            if (res && res.data) {
                setCountBook(res.data.bookCount)
                setCountOrder(res.data.orderCount)
                setCountUser(res.data.userCount)
            }
        }
        getCountDashboard();
    }, [countUser, countBook, countOrder])
    return (
        <Row gutter={16}>
            <Col span={12}>
                <Statistic title="Totol users" value={countUser} formatter={formatter} />
            </Col>
            <Col span={12}>
                <Statistic title="Total orders" value={countOrder} formatter={formatter} />
            </Col>
            <Col span={12}>
                <Statistic title="Total books" value={countBook} formatter={formatter} />
            </Col>
        </Row>
    )

}