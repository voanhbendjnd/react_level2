import { createBookAPI, getAllCategoriesAPI } from "@/services/api";
import { MAX_UPLOAD_IMAGE_SIZE } from "@/services/helper";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { App, Col, DatePicker, Form, Input, InputNumber, Modal, Row, Select, Upload, type GetProp, type UploadFile, type UploadProps } from "antd";
import type { UploadChangeParam } from "antd/es/upload";
import { Image, type FormProps } from "antd/lib";
import { useEffect, useState } from "react";

interface IProps {
    isOpenModalForm: boolean;
    setIsOpenModalForm: (v: boolean) => void;
    handleRefresh: () => void;
}
type UserUploadType = "coverImage" | "imgs"
// Cập nhật kiểu dữ liệu cho FieldType
type FieldType = {
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

const BookForm = (props: IProps) => {
    const { isOpenModalForm, setIsOpenModalForm, handleRefresh } = props;
    const { message, notification } = App.useApp();
    const [listCategories, setListCategories] = useState<{ label: string; value: string; }[]>([]);
    const [form] = Form.useForm();
    const [isSubmit, setIsSubmit] = useState<boolean>(false);
    const [loadingCoverImage, setLoadingCoverImage] = useState<boolean>(false);
    const [loadingImgs, setLoadingImgs] = useState<boolean>(false);
    const [previewOpen, setPreviewOpen] = useState<boolean>(false);
    const [previewImage, setPreviewImage] = useState<string>('');
    const [fileListImgs, setFileListImgs] = useState<UploadFile[]>([]);
    const [fileListCoverImage, setFileListCoverImage] = useState<UploadFile[]>([]);
    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        setIsSubmit(true);

        // Lấy file gốc từ mảng UploadFile của Ant Design
        const coverImageFile = values.coverImage?.[0]?.originFileObj;

        // Duyệt qua mảng và lấy file gốc cho từng ảnh
        const imgsFiles = values.imgs?.map(file => file.originFileObj);

        // Kiểm tra xem người dùng đã tải đủ ảnh lên chưa
        if (!coverImageFile || !imgsFiles || imgsFiles.some(file => !file)) {
            message.error("Vui lòng tải lên đủ ảnh cần thiết.");
            setIsSubmit(false);
            return;
        }

        // Gọi API với các đối tượng File đã được trích xuất
        const res = await createBookAPI(
            values.title,
            values.author,
            values.price,
            values.categories,
            values.publisher,
            values.isbn,
            values.description,
            values.language,
            values.stockQuantity,
            values.numberOfPages,
            coverImageFile as File, // Ép kiểu để khớp với hàm API
            imgsFiles as File[],
            values.publicationDate
            // Ép kiểu
        );

        if (res && res.data) {
            message.success("Tạo mới sách thành công");
            handleRefresh();
            setIsOpenModalForm(false);
            form.resetFields();
        }
        notification.open({
            message: "Thêm mới sách thất bại",
            description: JSON.stringify(res.message)
        });


        setIsSubmit(false);
    };

    useEffect(() => {
        const fetchCategories = async () => {
            const res = await getAllCategoriesAPI();
            if (res && res.data) {
                const d = res.data.map(x => ({ label: x, value: x }));
                setListCategories(d);
            }
        };
        fetchCategories();
    }, []);

    type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

    const getBase64 = (file: FileType): Promise<string> =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = (error) => reject(error);
        });

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

    const normFile = (e: any) => {
        if (Array.isArray(e)) {
            return e;
        }
        return e?.fileList;
    };

    const handleUploadFile: UploadProps['customRequest'] = ({ file, onSuccess, onError }) => {
        console.log("Đang giả lập quá trình tải lên...");
        setTimeout(() => {
            if (onSuccess) {
                console.log("Tải lên thành công!");
                onSuccess("ok");
            } else {
                console.log("Tải lên thất bại!");
            }
        }, 1000);
    };

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

    return (
        <Modal
            title="Thêm mới sản phẩm"
            open={isOpenModalForm}
            onOk={() => form.submit()}
            onCancel={() => {
                setIsOpenModalForm(false);
                form.resetFields();
            }}

            maskClosable={false}
            okText={"Tạo mới"}
            cancelText={"Hủy"}
            forceRender
        >
            <Form
                layout="vertical"
                form={form}
                onFinish={onFinish}
            >
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
                                listType="picture-card"
                                maxCount={1}
                                multiple={false}
                                // thực hiện quá trình xử lý file trước khi đi
                                customRequest={handleUploadFile}
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
                                customRequest={handleUploadFile}
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
    );
}

export default BookForm;