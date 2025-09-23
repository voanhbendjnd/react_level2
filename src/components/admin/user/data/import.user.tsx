import { InboxOutlined } from "@ant-design/icons";
import { App, Modal, Table, Upload } from 'antd';
import type { UploadProps } from 'antd';
import { useState } from "react";
import ExcelJS from 'exceljs';
import { createUsersAPI } from "@/services/api";
import templateFile from '@/assets/template/data.xlsx?url'
interface IProps {
    isOpenModalImport: boolean;
    setIsOpenModalImport: (v: boolean) => void;
    handleRefresh: () => void;
}

// save data table
interface IDataImport {
    name: string;
    email: string;
    phone: string;
    password: string;
    confirmPassword: string;
    address: string;
    role: string;
    createdAt: string;
    createdBy: string;
}

const ImportModalUser = (props: IProps) => {
    const { isOpenModalImport, setIsOpenModalImport, handleRefresh } = props;
    const { Dragger } = Upload;
    const [dataImport, setDataImport] = useState<IDataImport[]>([]);
    const { message, notification } = App.useApp();
    const handleUpdateUsers = async () => {
        const res = await createUsersAPI(dataImport);
        if (res.data) {
            message.success("Tất cả người dùng đã tạo mới")
            handleRefresh();

        }
        else {
            notification.error({
                message: "Tạo mới người dùng thất bại",
                description: JSON.stringify(res.message)
            })
        }
        setDataImport([]);
        setIsOpenModalImport(false)
    }
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
            }, 1000);
        },
        async onChange(info) {
            const { status } = info.file;
            if (status !== 'uploading') {
                console.log(info.file, info.fileList);
            }
            if (status === 'done') {
                message.success(`${info.file.name} file uploaded successfully.`);
                if (info.fileList && info.fileList.length > 0) {
                    const file = info.fileList[0].originFileObj!;
                    // load file to buffer
                    const workbook = new ExcelJS.Workbook();
                    const arrayBuffer = await file.arrayBuffer();
                    await workbook.xlsx.load(arrayBuffer);

                    // convert file to json
                    let jsonData: IDataImport[] = [];
                    workbook.eachSheet((worksheet) => {
                        // read first row as data keys
                        let firstRow = worksheet.getRow(1);
                        if (!firstRow.cellCount) {
                            return;
                        }

                        // Get headers - skip first empty cell
                        let keys: string[] = [];
                        firstRow.eachCell((cell, colNumber) => {
                            keys[colNumber] = cell.text || cell.value?.toString() || '';
                        });

                        console.log('Headers found:', keys); // Debug log

                        worksheet.eachRow((row, rowNumber) => {
                            if (rowNumber === 1) {
                                return; // Skip header row
                            }

                            let obj: any = {};
                            row.eachCell((cell, colNumber) => {
                                const header = keys[colNumber];
                                if (header) {
                                    // Map various possible header names to our interface
                                    let fieldName = header.toLowerCase().trim();
                                    if (fieldName.includes('name') || fieldName.includes('tên')) {
                                        obj.name = cell.text || cell.value?.toString() || '';
                                    } else if (fieldName.includes('email') || fieldName.includes('mail')) {
                                        obj.email = cell.text || cell.value?.toString() || '';
                                    } else if (fieldName.includes('phone') || fieldName.includes('số') || fieldName.includes('sdt')) {
                                        obj.phone = cell.text || cell.value?.toString() || '';
                                    }
                                    else if (fieldName.includes('password') || fieldName.includes('Mật khẩu') || fieldName.includes('password')) {
                                        obj.password = cell.text || cell.value?.toString() || '';
                                    }
                                    else if (fieldName.includes('confirmPassword') || fieldName.includes('Xác nhận mật khẩu') || fieldName.includes('confirmPassword')) {
                                        obj.phone = cell.text || cell.value?.toString() || '';
                                    }
                                    // Also keep original field name
                                    obj[header] = cell.text || cell.value?.toString() || '';
                                }
                            });

                            console.log('Row data:', obj); // Debug log
                            if (obj.name || obj.email || obj.phone || obj.password || obj.confirmPassword) {
                                jsonData.push(obj);
                            }
                        });
                    });
                    setDataImport(jsonData);
                }
            } else if (status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
            }
        },
        onDrop(e) {
            // Handle drop event if needed
        }
    };

    return (
        <Modal
            title="Import data user"
            width={"50vw"}
            open={isOpenModalImport}
            onOk={() => handleUpdateUsers()}
            onCancel={() => {
                setIsOpenModalImport(false);
                setDataImport([]);
            }}
            okButtonProps={{
                disabled: dataImport.length === 0
            }}
            okText="Chơi"
            maskClosable={false}
            destroyOnClose={true}
        >
            <Dragger {...propsUpload}>
                <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                </p>
                <p className="ant-upload-text">Click or drag file to this area to upload</p>
                <p className="ant-upload-hint">
                    Support for a single upload. Only accept .csv, .xlsx, .or
                    <a
                        onClick={e => e.stopPropagation()} // click vào con chứ không click vào cha
                        href={templateFile}
                        download
                    > Download sample file</a>
                </p>
            </Dragger>

            <div
                style={{
                    paddingTop: 20
                }}
            >
                <Table
                    title={() => <span>Data import</span>}
                    columns={[
                        { dataIndex: 'name', title: "Tên hiển thị" },
                        { dataIndex: "email", title: "Email" },
                        { dataIndex: 'phone', title: "Số điện thoại" },
                        { dataIndex: "password", title: "Mật khẩu" },
                        { dataIndex: 'confirmPassword', title: "Mật khẩu xác nhận" },
                    ]}
                    dataSource={dataImport}
                    pagination={false}
                    size="small"
                />
            </div>
        </Modal>
    );
};

export default ImportModalUser;