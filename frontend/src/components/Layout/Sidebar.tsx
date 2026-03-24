import React from 'react';
import { Layout, Menu } from 'antd';
import {
  DashboardOutlined,
  UserOutlined,
  DollarOutlined,
  FileTextOutlined,
  FormOutlined,
  NotificationOutlined,
  ApartmentOutlined,
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';

const { Sider } = Layout;

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { key: '/', icon: <DashboardOutlined />, label: 'Dashboard' },
    { key: '/profile', icon: <UserOutlined />, label: 'Hồ sơ cá nhân' },
    { key: '/payslips', icon: <DollarOutlined />, label: 'Phiếu lương' },
    { key: '/policies', icon: <FileTextOutlined />, label: 'Chính sách' },
    { key: '/requests', icon: <FormOutlined />, label: 'Yêu cầu HC' },
    { key: '/announcements', icon: <NotificationOutlined />, label: 'Thông báo' },
    { key: '/org-chart', icon: <ApartmentOutlined />, label: 'Sơ đồ tổ chức' },
  ];

  return (
    <Sider breakpoint="lg" collapsedWidth="0">
      <div style={{ height: 32, margin: 16, color: '#fff', textAlign: 'center', fontWeight: 'bold', fontSize: 16 }}>
        ESS Portal
      </div>
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[location.pathname]}
        items={menuItems}
        onClick={({ key }) => navigate(key)}
      />
    </Sider>
  );
};

export default Sidebar;
