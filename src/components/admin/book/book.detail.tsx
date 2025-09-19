import { FORMATE_DATE_VN } from "@/services/helper";
import { Descriptions, Divider, Drawer, Image, Upload, type DescriptionsProps, type GetProp, type UploadFile, type UploadProps } from "antd";
import dayjs from "dayjs";
import { useState } from "react";

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
    const [fileList, setFileList] = useState<UploadFile[]>([
        {
            uid: '-1',
            name: 'image.png',
            status: 'done',
            url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
        },
        {
            uid: '-2',
            name: 'image.png',
            status: 'done',
            url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
        },
        {
            uid: '-3',
            name: 'image.png',
            status: 'done',
            url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
        },
        {
            uid: '-4',
            name: 'image.png',
            status: 'done',
            url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
        },


    ]);
    const handlePreview = async (file: UploadFile) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj as FileType);
        }

        setPreviewImage(file.url || (file.preview as string));
        setPreviewOpen(true);
    };


    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const { dataDetail, setDataDetail, isOpenModalDetail, setIsOpenModalDetail } = props;
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
            children: <p>{dayjs(dataDetail?.updatedAt).format(FORMATE_DATE_VN)}</p>,
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