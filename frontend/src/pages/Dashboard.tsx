import React, { useEffect, useState } from 'react';
import { Card, Col, Row, Typography, List, Tag, Statistic, Spin } from 'antd';
import { NotificationOutlined, FormOutlined, TeamOutlined } from '@ant-design/icons';
import { useAuth } from '../context/AuthContext';
import { announcementApi, requestApi } from '../services/api';
import type { Announcement, AdminRequest } from '../types';

const { Title } = Typography;

const STATUS_COLORS: Record<string, string> = {
  PENDING: 'orange',
  APPROVED: 'green',
  REJECTED: 'red',
};

const STATUS_LABELS: Record<string, string> = {
  PENDING: 'Chờ duyệt',
  APPROVED: 'Đã duyệt',
  REJECTED: 'Từ chối',
};

const Dashboard: React.FC = () => {
  const { user, isHrAdmin } = useAuth();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [requests, setRequests] = useState<AdminRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [annRes, reqRes] = await Promise.all([
          announcementApi.getAll(),
          requestApi.getAll(),
        ]);
        setAnnouncements(annRes.data.data || []);
        setRequests(reqRes.data.data || []);
      } catch { /* handled by interceptor */ }
      setLoading(false);
    };
    fetchData();
  }, []);

  const pendingCount = requests.filter((r) => r.status === 'PENDING').length;

  if (loading) return <Spin size="large" style={{ display: 'block', margin: '100px auto' }} />;

  return (
    <div>
      <Title level={4}>Xin chào, {user?.fullName}!</Title>
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic title="Thông báo mới" value={announcements.length} prefix={<NotificationOutlined />} />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic title="Yêu cầu chờ duyệt" value={pendingCount} prefix={<FormOutlined />} valueStyle={{ color: pendingCount > 0 ? '#faad14' : '#52c41a' }} />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic title="Tổng yêu cầu" value={requests.length} prefix={<TeamOutlined />} />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card title="Thông báo gần đây" size="small">
            <List
              dataSource={announcements.slice(0, 5)}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    title={item.title}
                    description={new Date(item.createdAt).toLocaleDateString('vi-VN')}
                  />
                </List.Item>
              )}
              locale={{ emptyText: 'Chưa có thông báo' }}
            />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title={isHrAdmin ? 'Yêu cầu mới nhất' : 'Yêu cầu của tôi'} size="small">
            <List
              dataSource={requests.slice(0, 5)}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    title={item.type === 'WORK_CONFIRMATION' ? 'Xác nhận công tác' : 'Cấp lại thẻ'}
                    description={new Date(item.createdAt).toLocaleDateString('vi-VN')}
                  />
                  <Tag color={STATUS_COLORS[item.status]}>{STATUS_LABELS[item.status]}</Tag>
                </List.Item>
              )}
              locale={{ emptyText: 'Chưa có yêu cầu' }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
