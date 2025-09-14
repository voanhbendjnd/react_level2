import Icon, { InboxOutlined } from "@ant-design/icons";
import { Modal, Table, Upload, message } from 'antd';
import type { UploadProps } from 'antd';
interface IProps {
    isOpenModalImport: boolean;
    setIsOpenModalImport: (v: boolean) => void;
}
const ImportModalUser = (props: IProps) => {
    const { isOpenModalImport, setIsOpenModalImport } = props;
    const { Dragger } = Upload;

    const propsUpload: UploadProps = {
        name: 'file',
        multiple: false,
        maxCount: 1,
        accept: ".csv,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        customRequest({ file, onSuccess }) {
            setTimeout(() => {
                if (onSuccess) {
                    onSuccess("ok");
                }
            }, 1000)
        },
        onChange(info) {
            const { status } = info.file;
            if (status !== 'uploading') {
                console.log(info.file, info.fileList);
                setIsOpenModalImport(false);
                isOpenModalImport
            }
            if (status === 'done') {
                message.success(`${info.file.name} file uploaded successfully.`);
            } else if (status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
            }
        },
        onDrop(e) {

        }

    };
    return (
        <Modal
            title="Import data user"
            width={"50vw"}
            open={isOpenModalImport}
            onOk={() => setIsOpenModalImport(false)}
            onCancel={() => setIsOpenModalImport(false)}
            // onText="Import data"
            okButtonProps={{
                disabled: true
            }}
            maskClosable={false}
        >
            <Dragger {...props}>
                <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                </p>
                <p className="ant-upload-text">Click or drag file to this area to upload</p>
                <p className="ant-upload-hint">
                    Support for a single or bulk upload. Strictly prohibit from uploading company data or other
                    band files
                </p>
            </Dragger>,
            <div
                style={{
                    paddingTop: 20
                }}
            >
                <Table
                    title={() => <span>Dữ liệu import</span>}
                    columns={[
                        { dataIndex: 'name', title: "Tên hiển thị" },
                        { dataIndex: "email", title: "Email" },
                        { dataIndex: 'phone', title: "Số điện thoại" },
                    ]}
                />
            </div>
        </Modal>
    )
}
export default ImportModalUser;