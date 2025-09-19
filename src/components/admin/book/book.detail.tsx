import { FORMATE_DATE_VN } from "@/services/helper";
import { Descriptions, Divider, Drawer, Image, Upload, type DescriptionsProps, type GetProp, type UploadFile, type UploadProps } from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from 'uuid';
interface IProps {
    dataDetail?: IBooksTable | undefined;
    setDataDetail: (v: IBooksTable | undefined) => void;
    isOpenModalDetail: boolean;
    setIsOpenModalDetail: (v: boolean) => void;
}
type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];
const getBase64 = (file: FileType): Promise<string> =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
    });
const BookDetail = (props: IProps) => {
    const { dataDetail, setDataDetail, isOpenModalDetail, setIsOpenModalDetail } = props;

    const [fileList, setFileList] = useState<UploadFile[]>([]);
    useEffect(() => {
        if (dataDetail) {
            let coverImage: any = {}, imgs: UploadFile[] = [];
            if (dataDetail.coverImage) {
                coverImage = {
                    uid: uuidv4(),
                    name: dataDetail.coverImage,
                    status: 'done',
                    url: `http://localhost:8080/api/v1/images/book/${dataDetail.coverImage}`
                }
            }
            if (dataDetail.imgs && dataDetail.imgs.length > 0) {
                dataDetail.imgs.map(it => {
                    imgs.push({
                        uid: uuidv4(),
                        name: it,
                        status: 'done',
                        url: `http://localhost:8080/api/v1/images/book/${it}`

                    })
                })
            }

            setFileList([coverImage, ...imgs])
        }
    }, [dataDetail])
    const handlePreview = async (file: UploadFile) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj as FileType);
        }

        setPreviewImage(file.url || (file.preview as string));
        setPreviewOpen(true);
    };


    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const items: DescriptionsProps['items'] = [
        {
            key: "id",
            label: "ID",
            children: <p>{dataDetail?.id}</p>,
            span: 1
        },
        {
            key: "title",
            label: "Tên sách",
            children: <p>{dataDetail?.title}</p>,
            span: 2
        },
        {
            key: "author",
            label: "Tác giả",
            children: <p>{dataDetail?.author}</p>,
            span: 1
        },
        {
            key: "categories",
            label: "Thể loại",
            children: <p>{dataDetail?.categories}</p>,
            span: 2
        },
        {
            key: "price",
            label: "Giá",
            children: <p>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(dataDetail?.price ?? 0)}</p>
            ,
            span: 3
        },
        {
            key: "createdAt",
            label: "Ngày tạo",
            children: <p>{dayjs(dataDetail?.createdAt).format(FORMATE_DATE_VN)}</p>,
            span: 1
        },
        {
            key: "updatedAt",
            label: "Ngày cập nhật",
            children: <p>{dayjs(dataDetail?.updatedAt).format(FORMATE_DATE_VN)}</p>,
            span: 2
        },
    ]
    return (
        <>
            <Drawer
                open={isOpenModalDetail}
                onClose={() => {
                    setDataDetail(undefined);
                    setIsOpenModalDetail(false);
                }}
                width={"100vh"}
            >
                <Descriptions title="Thông tin của sách" bordered items={items}
                />;
                <Divider orientation="left">Image </Divider>
                <Upload
                    action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
                    listType="picture-card"
                    fileList={fileList}
                    onPreview={handlePreview}
                    showUploadList={
                        {
                            showRemoveIcon: false
                        }
                    }
                >
                </Upload>
                {previewImage && (
                    <Image
                        wrapperStyle={{ display: 'none' }}
                        preview={{
                            visible: previewOpen,
                            onVisibleChange: (visible) => setPreviewOpen(visible),
                            afterOpenChange: (visible) => !visible && setPreviewImage(''),
                        }}
                        src={previewImage}
                    />
                )}


            </Drawer>
        </>
    )
}

export default BookDetail;