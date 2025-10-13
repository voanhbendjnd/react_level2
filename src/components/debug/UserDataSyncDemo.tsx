import React from 'react';
import { Card, Space, Typography, Tag, Button } from 'antd';
import { useCurrentApp } from '@/components/context/app.context';

const { Text, Title } = Typography;

/**
 * Component demo để test việc đồng bộ user data
 * Chỉ hiển thị trong development mode
 */
export const UserDataSyncDemo: React.FC = () => {
    const { user, refreshUserData } = useCurrentApp();

    const handleRefreshData = async () => {
        console.log('Manual refresh user data...');
        await refreshUserData();
    };

    // Chỉ hiển thị trong development
    if (process.env.NODE_ENV !== 'development') {
        return null;
    }

    return (
        <Card
            title="🔄 User Data Sync Demo (Development Only)"
            style={{
                position: 'fixed',
                bottom: 10,
                right: 10,
                width: 300,
                zIndex: 9999,
                maxHeight: '50vh',
                overflow: 'auto'
            }}
            size="small"
        >
            <Space direction="vertical" style={{ width: '100%' }}>
                <div>
                    <Title level={5}>Current User Data</Title>
                    {user ? (
                        <Space direction="vertical" size="small" style={{ width: '100%' }}>
                            <div>
                                <Text strong>ID:</Text> <Text code>{user.id}</Text>
                            </div>
                            <div>
                                <Text strong>Name:</Text> <Tag color="blue">{user.name}</Tag>
                            </div>
                            <div>
                                <Text strong>Email:</Text> <Text>{user.email}</Text>
                            </div>
                            <div>
                                <Text strong>Phone:</Text> <Text>{user.phone}</Text>
                            </div>
                            <div>
                                <Text strong>Gender:</Text> <Tag color="green">{user.gender}</Tag>
                            </div>
                            <div>
                                <Text strong>Address:</Text> <Text style={{ fontSize: '11px' }}>{user.address}</Text>
                            </div>
                        </Space>
                    ) : (
                        <Text type="secondary">No user data</Text>
                    )}
                </div>

                <div>
                    <Button
                        size="small"
                        type="primary"
                        onClick={handleRefreshData}
                        disabled={!user}
                        block
                    >
                        🔄 Refresh User Data
                    </Button>
                </div>

                <div style={{ fontSize: '11px', color: '#999' }}>
                    <div>Test: Go to My Account → Update info → Check this panel</div>
                    <div>Data should sync automatically!</div>
                </div>
            </Space>
        </Card>
    );
};

export default UserDataSyncDemo;
