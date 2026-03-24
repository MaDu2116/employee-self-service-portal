import React from 'react';
import { Layout, Button, Space, Typography, Tag } from 'antd';
import { LogoutOutlined } from '@ant-design/icons';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const { Header } = Layout;
const { Text } = Typography;

const AppHeader: React.FC = () => {
  const { user, logout, isHrAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Header style={{ background: '#fff', padding: '0 24px', display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
      <Space>
        <Text>{user?.fullName}</Text>
        <Tag color={isHrAdmin ? 'red' : 'blue'}>
          {isHrAdmin ? 'HR Admin' : 'Nhân viên'}
        </Tag>
        <Button icon={<LogoutOutlined />} onClick={handleLogout} type="text">
          Đăng xuất
        </Button>
      </Space>
    </Header>
  );
};

export default AppHeader;
