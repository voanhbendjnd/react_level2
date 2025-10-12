import React, { useState, useEffect } from 'react';
import { Card, Button, Space, Typography, Tag, Alert } from 'antd';
import { useCurrentApp } from '@/components/context/app.context';
import { authService } from '@/services/auth.service';
import { useAuthEvents } from '@/hooks/useAuthEvents';

const { Text, Title } = Typography;

/**
 * Component debug để test chức năng single session
 * Chỉ hiển thị trong development mode
 */
export const AuthDebugger: React.FC = () => {
    const { isAuthenticated, user } = useCurrentApp();
    const [authEvents, setAuthEvents] = useState<string[]>([]);
    const [tokenInfo, setTokenInfo] = useState<{ hasToken: boolean, token: string | null }>({ hasToken: false, token: null });

    // Lắng nghe auth events
    useAuthEvents(
        (reason) => {
            const event = `Force logout: ${reason || 'unknown'}`;
            setAuthEvents(prev => [...prev, `${new Date().toLocaleTimeString()}: ${event}`]);
        },
        () => {
            const event = 'Session expired';
            setAuthEvents(prev => [...prev, `${new Date().toLocaleTimeString()}: ${event}`]);
        }
    );

    // Cập nhật token info
    useEffect(() => {
        const updateTokenInfo = () => {
            const token = localStorage.getItem('access_token');
            setTokenInfo({
                hasToken: !!token,
                token: token ? `${token.substring(0, 20)}...` : null
            });
        };

        updateTokenInfo();
        const interval = setInterval(updateTokenInfo, 1000);
        return () => clearInterval(interval);
    }, []);

    const handleForceLogout = () => {
        authService.forceLogout('single_session');
    };

    const handleClearEvents = () => {
        setAuthEvents([]);
    };

    // Chỉ hiển thị trong development
    if (process.env.NODE_ENV !== 'development') {
        return null;
    }

    return (
        <Card
            title="🔧 Auth Debugger (Development Only)"
            style={{
                position: 'fixed',
                top: 10,
                right: 10,
                width: 350,
                zIndex: 9999,
                maxHeight: '80vh',
                overflow: 'auto'
            }}
            size="small"
        >
            <Space direction="vertical" style={{ width: '100%' }}>
                {/* Authentication Status */}
                <div>
                    <Title level={5}>Authentication Status</Title>
                    <Space>
                        <Tag color={isAuthenticated ? 'green' : 'red'}>
                            {isAuthenticated ? 'Authenticated' : 'Not Authenticated'}
                        </Tag>
                        {user && <Text type="secondary">({user.name})</Text>}
                    </Space>
                </div>

                {/* Token Status */}
                <div>
                    <Title level={5}>Token Status</Title>
                    <Space direction="vertical" style={{ width: '100%' }}>
                        <Tag color={tokenInfo.hasToken ? 'green' : 'red'}>
                            {tokenInfo.hasToken ? 'Token Present' : 'No Token'}
                        </Tag>
                        {tokenInfo.token && (
                            <Text code style={{ fontSize: '10px', wordBreak: 'break-all' }}>
                                {tokenInfo.token}
                            </Text>
                        )}
                    </Space>
                </div>

                {/* Test Actions */}
                <div>
                    <Title level={5}>Test Actions</Title>
                    <Button
                        size="small"
                        danger
                        onClick={handleForceLogout}
                        disabled={!isAuthenticated}
                    >
                        Simulate Force Logout
                    </Button>
                </div>

                {/* Auth Events */}
                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Title level={5}>Auth Events</Title>
                        <Button size="small" onClick={handleClearEvents}>Clear</Button>
                    </div>
                    <div style={{ maxHeight: 200, overflow: 'auto', backgroundColor: '#f5f5f5', padding: 8, borderRadius: 4 }}>
                        {authEvents.length === 0 ? (
                            <Text type="secondary" style={{ fontSize: '12px' }}>No events yet...</Text>
                        ) : (
                            authEvents.map((event, index) => (
                                <div key={index} style={{ fontSize: '11px', marginBottom: 4 }}>
                                    {event}
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Instructions */}
                <Alert
                    message="Test Single Session"
                    description="1. Login with same account in another tab/browser 2. Make API call here 3. Should auto logout"
                    type="info"
                    showIcon
                />
            </Space>
        </Card>
    );
};

export default AuthDebugger;
