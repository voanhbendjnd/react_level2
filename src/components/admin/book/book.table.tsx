import { deleteBookAPI, fetchBooksAPI, getAllCategoriesAPI } from "@/services/api";
import { dataRangeValidate } from "@/services/helper";
import { DeleteOutlined, EditOutlined, ExportOutlined } from "@ant-design/icons";
import { ProTable, type ActionType, type ProColumns } from "@ant-design/pro-components"
import { Button, message, notification, Popconfirm, Space } from "antd";
import { useEffect, useRef, useState } from "react";
import BookDetail from "./book.detail";
import BookForm from "./book.form";
import { BookUpdate } from "./book.update";
import { CSVLink } from "react-csv";
interface IBookTablePage {
    id: number;
    title: string;
    author: string;
    price: number;
    updatedAt: string;
    createdAt: string;
    coverImage: string;
    imgs: string[];
    categories: string[],
    publisher: string,
    isbn: string,
    description: string,
    language: string,
    stockQuantity: number,
    numberOfPages: number,
    publicationDate: string,
    sold: number,
    totalPreview: number;

}
type TSearch = {
    title: string;
    categories: string;
    author: string;
    priceRange: string;
    updatedAtRange: string;
    minPrice?: number;
    maxPrice?: number;
}
const BookPage = () => {
    const actionRef = useRef<ActionType>();
    const [isOpenModalForm, setIsOpenModalForm] = useState<boolean>(false);
    const [dataDetail, setDataDetail] = useState<IBooksTable>()
    const [isLoadingDeleteBook, setIsLoadingDeleteBook] = useState<boolean>(false);
    const [isOpenModalDetail, setIsOpenModalDetail] = useState<boolean>(false);
    const [isOpenModalUpdate, setIsOpenModalUpdate] = useState<boolean>(false);
    const [listCategories, setListCategories] = useState<{ label: string; value: string; }[]>([]);
    const [currentDataTable, setCurrentDataTable] = useState<IBookTablePage[]>([]);
    const handleRefresh = () => {
        actionRef.current?.reload();
    };

    const deleteBook = async (id: number) => {
        const res = await deleteBookAPI(id);
        setIsLoadingDeleteBook(true);
        if (res && res.data) {
            message.success("Xóa sách thành cồng")
            handleRefresh();
        }
        else {
            notification.error({
                message: "Xóa sách thất bại",
                description: JSON.stringify(res.message)
            })
        }
        setIsLoadingDeleteBook(false);
    }
    useEffect(() => {
        const fetchCategories = async () => {
            const res = await getAllCategoriesAPI();
            if (res && res.data) {
                const d = res.data.map(x => ({ label: x, value: x }))
                setListCategories(d);
            }
        }
        fetchCategories();
    }, [])
    const columns: ProColumns<IBookTablePage>[] = [
        {
            title: "ID",
            dataIndex: "id",
            search: false,
            render(dom, entity, index, action, schema) {
                return (
                    <a href="#" onClick={() => {
                        setDataDetail(entity)
                        setIsOpenModalDetail(true)
                    }}>
                        {entity.id}
                    </a>
                )
            }
        },
        {
            title: "Tên sách",
            dataIndex: "title",
        },
        {
            title: "Thể loại",
            dataIndex: "categories",
            valueType: "select",
            valueEnum: Object.fromEntries(
                listCategories.map(item => [item.value, item.label])
            ),

        },
        {
            title: "Tác giả",
            dataIndex: "author",
        },
        {
            title: "Giá",
            dataIndex: "price",
            search: false,
            sorter: true,
            render(dom, entity, index, action, schema) {
                return (
                    <>
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: "VND" }).format(entity.price)}
                    </>
                )
            }
        },
        {
            title: "Giá",
            dataIndex: "priceRange",
            valueType: "digitRange",
            search: {
                transform: (value) => ({
                    minPrice: value[0],
                    maxPrice: value[1],
                }),
            },
            hidden: true,
        },
        {
            title: "Ngày cập nhật",
            dataIndex: "updatedAt",
            valueType: "date",
            width: 200,
            search: false
            // set width search updatedAt 
            // search: {
            //     transform: (value) => ({
            //         updatedAt: value,
            //     }),
            // },
        },
        {
            title: "Ngày cập nhật",
            dataIndex: "updatedAtRange",
            valueType: "dateRange",
            hidden: true,
            search: true,
            sorter: true,
        },
        {
            title: "Thao tác",
            key: "action",
            valueType: "option",
            width: 110,
            render: (_, record) => [
                <Space key="action-space"
                    style={{
                        gap: "25px"
                    }}>
                    <EditOutlined

                        style={{ cursor: "pointer", color: "blue" }}
                        onClick={() => {
                            setDataDetail(record)
                            setIsOpenModalUpdate(true)
                        }}

                    />
                    <Popconfirm
                        title="Xác nhận xóa sách này?"
                        onConfirm={() => {
                            deleteBook(record.id)
                        }}
                        okButtonProps={{ loading: isLoadingDeleteBook }}
                    >
                        <DeleteOutlined
                            style={{ cursor: "pointer", color: "red" }} />
                    </Popconfirm>

                </Space>
            ]
        }

    ]
    return (
        <>
            <ProTable<IBookTablePage, TSearch>
                actionRef={actionRef}
                columns={columns}
                bordered
                size="large"
                headerTitle="Bảng quản lý sách"
                tooltip="Thêm sửa xóa sách"
                showHeader={true}
                search={{
                    labelWidth: 'auto'
                }}
                // ô đứng trước id
                rowSelection={{
                    type: 'checkbox',
                }}
                rowKey="id"
                pagination={{
                    showSizeChanger: true,
                    showQuickJumper: true,
                    showTotal: (total, range) => {
                        return (
                            <div>
                                Hiển thị {range[0]}-{range[1]} trong tổng số {total} trang
                            </div>
                        );
                    },
                    pageSizeOptions: ['5', '10', '20', '50'],
                    defaultPageSize: 5,
                    hideOnSinglePage: false,
                    simple: false,
                }}
                toolBarRender={() => [
                    <CSVLink
                        data={currentDataTable}
                        filename='export-book.csv'>
                        <Button
                            icon={<ExportOutlined />}
                            type="primary"
                        >
                            Export
                        </Button>
                    </CSVLink>
                    ,
                    <Button
                        key="add"
                        type="primary"
                        onClick={() => {
                            setIsOpenModalForm(true);
                        }}
                        style={{
                            backgroundColor: "#52C41A",
                            borderColor: "#52C41A"
                        }}
                    >
                        Tạo mới

                    </Button>
                ]}
                request={async (params, sort) => {
                    try {
                        let query = `page=${params.current}&size=${params.pageSize}`
                        const { maxPrice, minPrice } = params;
                        const filters: string[] = [];
                        filters.push(`active:true`)
                        if (params.title) {
                            filters.push(`title~'${params.title}'`)
                        }
                        if (params.author) {
                            filters.push(`author~'${params.author}'`)
                        }
                        if (maxPrice !== undefined && minPrice !== undefined) {
                            filters.push(`price>='${minPrice}' and price<='${maxPrice}'`)
                        }
                        const ddate = dataRangeValidate(params.updatedAtRange);
                        if (params.updatedAtRange && ddate) {
                            filters.push(`updatedAt>='${ddate[0]}' and updatedAt<='${ddate[1]}'`)
                        }
                        if (filters.length > 0) {
                            query += `&filter=${filters.join(' and ')}`
                        }
                        if (sort && sort.price) {
                            query += `&sort=price,${sort.price === "ascend" ? "asc" : "desc"}`;
                        }
                        else {
                            query += `&sort=updatedAt,desc`;
                        }

                        const res = await fetchBooksAPI(query);
                        if (res.data) {
                            setCurrentDataTable(res.data?.result ?? []);
                        }
                        const responseData = {
                            data: res.data?.result || [],
                            success: true,
                            total: res.data?.meta.total || 0,
                        }
                        return responseData;
                    }
                    catch (error) {
                        return {
                            data: [],
                            success: false,
                            total: 0,
                        };
                    }
                }}
            />
            <BookDetail
                dataDetail={dataDetail}
                setDataDetail={setDataDetail}
                isOpenModalDetail={isOpenModalDetail}
                setIsOpenModalDetail={setIsOpenModalDetail}
            />
            <BookForm
                handleRefresh={handleRefresh}
                setIsOpenModalForm={setIsOpenModalForm}
                isOpenModalForm={isOpenModalForm}
            />
            <BookUpdate
                dataDetail={dataDetail}
                setDataDetail={setDataDetail}
                isOpenModalUpdate={isOpenModalUpdate}
                setIsOpenModalUpdate={setIsOpenModalUpdate}
                handleRefresh={handleRefresh}
            />
        </>



    )
}

export default BookPage