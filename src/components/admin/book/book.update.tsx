import { getAllCategoriesAPI } from "@/services/api";
import { MAX_UPLOAD_IMAGE_SIZE } from "@/services/helper";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { App, Col, DatePicker, Form, Image, Input, InputNumber, Modal, Row, Select, Upload, type FormProps, type GetProp, type UploadFile, type UploadProps } from "antd"
import type { UploadChangeParam } from "antd/es/upload";
import dayjs from "dayjs";
import { v4 as uuidv4 } from 'uuid';

import { useEffect, useState } from "react";
interface IProps {
    isOpenModalUpdate: boolean;
    setIsOpenModalUpdate: (v: boolean) => void;
    handleRefresh: () => void;
    dataDetail: IBooksTable | undefined;
    setDataDetail: (v: IBooksTable) => void;
}
type FieldType = {
    id: number;
    title: string;
    author: string;
    price: number;
    categories: string[];
    publisher: string;
    isbn: string;
    description: string;
    language: string;
    stockQuantity: number;
    numberOfPages: number;
    coverImage: UploadFile[]; // Chỉnh lại thành mảng UploadFile
    imgs: UploadFile[];        // Chỉnh lại thành mảng UploadFile
    publicationDate: string; // Thêm trường này

}
type UserUploadType = "coverImage" | "imgs"

export const BookUpdate = (props: IProps) => {
    const [form] = Form.useForm();
    const { message, notification } = App.useApp();
    const [previewOpen, setPreviewOpen] = useState<boolean>(false);

    const [previewImage, setPreviewImage] = useState<string>('');
    const [loadingCoverImage, setLoadingCoverImage] = useState<boolean>(false);
    const [loadingImgs, setLoadingImgs] = useState<boolean>(false);
    const [listCategories, setListCategories] = useState<{ label: string; value: string; }[]>([]);
    const { isOpenModalUpdate, setIsOpenModalUpdate, dataDetail, setDataDetail, handleRefresh } = props;
    const uploadButtonCoverImage = (
        <div>
            {loadingCoverImage ? <LoadingOutlined /> : <PlusOutlined />}
            <div style={{ marginTop: 8 }}>Upload</div>
        </div>
    );

    const uploadButtonImgs = (
        <div>
            {loadingImgs ? <LoadingOutlined /> : <PlusOutlined />}
            <div style={{ marginTop: 8 }}>Upload</div>
        </div>
    );

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
    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {

        // Lấy file gốc từ mảng UploadFile của Ant Design
        const coverImageFile = values.coverImage?.[0]?.originFileObj;

        // Duyệt qua mảng và lấy file gốc cho từng ảnh
        const imgsFiles = values.imgs?.map(file => file.originFileObj);

        // Kiểm tra xem người dùng đã tải đủ ảnh lên chưa
        if (!coverImageFile || !imgsFiles || imgsFiles.some(file => !file)) {
            return;
        }
    }
    const normFile = (e: any) => {
        if (Array.isArray(e)) {
            return e;
        }
        return e?.fileList;
    };
    const getBase64 = (file: FileType): Promise<string> =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = (error) => reject(error);
        });
    const handlePreview = async (file: UploadFile) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj as FileType);
        }
        setPreviewImage(file.url || (file.preview as string));
        setPreviewOpen(true);
    };

    const handleChange = (info: UploadChangeParam, type: UserUploadType) => {
        if (info.file.status === 'uploading') {
            type === "imgs" ? setLoadingImgs(true) : setLoadingCoverImage(true);
            return;
        }
        if (info.file.status === 'done') {
            type === "imgs" ? setLoadingImgs(false) : setLoadingCoverImage(false);
        }
    };
    type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

    const beforeUpload = (file: FileType) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('Chỉ được chọn ảnh là file JPG hoặc PNG!');
        }
        const isLt2M = file.size / 1024 / 1024 < MAX_UPLOAD_IMAGE_SIZE;
        if (!isLt2M) {
            message.error(`Ảnh phải có dung lượng bé hơn ${MAX_UPLOAD_IMAGE_SIZE}MB!`);
        }
        return isJpgOrPng && isLt2M || Upload.LIST_IGNORE; // nếu file lớn hơn 2MB thì quăng lỗi
    };
    const [fileList, setFileList] = useState<UploadFile[]>([]);

    useEffect(() => {
        if (dataDetail) {
            const coverImageFile: UploadFile[] = dataDetail.coverImage
                ? [{
                    uid: uuidv4(),
                    name: dataDetail.coverImage,
                    status: 'done',
                    url: `http://localhost:8080/api/v1/images/book/${dataDetail.coverImage}`
                }]
                : [];

            // Sửa URL cho ảnh slider, sử dụng 'it' thay vì 'dataDetail.coverImage'
            const imgsFiles: UploadFile[] = dataDetail.imgs
                ? dataDetail.imgs.map(it => ({
                    uid: uuidv4(),
                    name: it,
                    status: 'done',
                    url: `http://localhost:8080/api/v1/images/book/${it}` // Sửa lỗi URL tại đây
                }))
                : [];
            form.setFieldsValue({
                id: dataDetail.id,
                title: dataDetail.title,
                author: dataDetail.author,
                price: dataDetail.price,
                publisher: dataDetail.publisher,
                isbn: dataDetail.isbn,
                language: dataDetail.language,
                stockQuantity: dataDetail.stockQuantity,
                numberOfPages: dataDetail.numberOfPages,
                publicationDate: dayjs(dataDetail.publicationDate), // Chuyển chuỗi thành đối tượng Day.js
                description: dataDetail.description,
                categories: dataDetail.categories,
                coverImage: coverImageFile,
                imgs: imgsFiles,
            })
        }
    }, [dataDetail, form])
    return (
        <Modal
            title="Cập nhật sản phẩm"
            open={isOpenModalUpdate}
            onCancel={() => { setIsOpenModalUpdate(false) }}
            width={"100vh"}
        >
            <Form
                layout="vertical"
                form={form}
                onFinish={onFinish}
            >
                <Col>
                    <Form.Item<FieldType>
                        label="ID"
                        name="id"
                        hidden
                    >
                    </Form.Item>

                </Col>
                <Row gutter={[16, 0]}>
                    <Col span={12}>
                        <Form.Item<FieldType>
                            label="Tên sách"
                            name="title"
                            rules={[{ required: true, message: 'Tên sách không được bỏ trống' }]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item<FieldType>
                            label="Tác giả"
                            name="author"
                            rules={[{ required: true, message: 'Không được bỏ trống' }]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item<FieldType>
                            label="Giá"
                            name="price"
                            rules={[{ required: true, message: 'Không được bỏ trống' }]}
                        >
                            <InputNumber
                                min={1}
                                style={{ width: '100%' }}
                                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                addonAfter=" VND"
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item<FieldType>
                            label="Nhà xuất bản"
                            name="publisher"
                            rules={[{ required: true, message: 'Không được bỏ trống' }]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item<FieldType>
                            label="Isbn"
                            name="isbn"
                            rules={[{ required: true, message: 'Không được bỏ trống' }]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item<FieldType>
                            label="Ngôn ngữ"
                            name="language"
                            rules={[{ required: true, message: 'Không được bỏ trống' }]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item<FieldType>
                            label="Số trang"
                            name="numberOfPages"
                            rules={[{ required: true, message: 'Không được bỏ trống' }]}
                        >
                            <InputNumber min={1} style={{ width: '100%' }} />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="Ngày xuất bản"
                            name="publicationDate"
                            rules={[{ required: true, message: 'Vui lòng chọn ngày xuất bản' }]}
                        >
                            <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item<FieldType>
                            label="Số lượng"
                            name="stockQuantity"
                            rules={[{ required: true, message: 'Không được bỏ trống' }]}
                        >
                            <InputNumber min={1} style={{ width: '100%' }} />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item<FieldType>
                            label="Mô tả"
                            name="description"
                            rules={[{ required: true, message: 'Không được bỏ trống' }]}
                        >
                            <Input.TextArea />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item<FieldType>
                            label="Thể loại"
                            name="categories"
                            rules={[{ required: true, message: 'Không được bỏ trống' }]}
                        >
                            <Select
                                showSearch
                                allowClear
                                options={listCategories}
                                mode="multiple" // Cho phép chọn nhiều thể loại
                            />
                        </Form.Item>
                    </Col>

                </Row>
                <Row gutter={[16, 0]}>
                    <Col span={12}>
                        <Form.Item<FieldType>
                            label="Ảnh sách"
                            name="coverImage"
                            rules={[{ required: true, message: 'Không được bỏ trống' }]}
                            valuePropName="fileList"
                            getValueFromEvent={normFile}
                        >
                            <Upload
                                fileList={fileList}
                                listType="picture-card"
                                maxCount={1}
                                multiple={false}
                                // trả về true or false, true thì tiếp tục quá trình, còn false thì hủy
                                beforeUpload={beforeUpload}
                                // nhận các trạng thái như uploading, done, error, removed, hiển thị icon loading nếu status là loading
                                onChange={(info) => handleChange(info, 'coverImage')}
                                // cho phép xem trước các hình ảnh đã tải lên
                                onPreview={handlePreview}
                            >
                                {uploadButtonCoverImage}
                            </Upload>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item<FieldType>
                            label="Ảnh slider"
                            name="imgs"
                            rules={[{ required: true, message: 'Không được bỏ trống' }]}
                            valuePropName="fileList"
                            getValueFromEvent={normFile}
                        >
                            <Upload
                                listType="picture-card"
                                multiple
                                beforeUpload={beforeUpload}
                                onChange={(info) => handleChange(info, 'imgs')}
                                onPreview={handlePreview}
                            >
                                {uploadButtonImgs}
                            </Upload>
                        </Form.Item>
                    </Col>
                </Row>

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
            </Form>
        </Modal>
    )
}