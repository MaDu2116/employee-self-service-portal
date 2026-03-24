import React, { useEffect, useState } from 'react';
import { List, Card, Typography, Button, Modal, Form, Input, message, Spin, Space, Empty } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { announcementApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Announcement } from '../types';

const { Title, Paragraph } = Typography;
const { TextArea } = Input;

const Announcements: React.FC = () => {
  const { isHrAdmin } = useAuth();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form] = Form.useForm();

  const fetchAnnouncements = async () => {
    try {
      const res = await announcementApi.getAll();
      setAnnouncements(res.data.data || []);
    } catch { /* handled */ }
    setLoading(false);
  };

  useEffect(() => { fetchAnnouncements(); }, []);

  const handleCreate = async (values: { title: string; content: string }) => {
    try {
      await announcementApi.create(values);
      message.success('Đăng thông báo thành công');
      setModalOpen(false);
      form.resetFields();
      fetchAnnouncements();
    } catch (error: unknown) {
      const err = error as { response?: { data?: { error?: string } } };
      message.error(err.response?.data?.error || 'Đăng thất bại');
    }
  };

  if (loading) return <Spin size="large" style={{ display: 'block', margin: '100px auto' }} />;

  return (
    <div>
      <Space style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <Title level={4} style={{ margin: 0 }}>Thông báo nội bộ</Title>
        {isHrAdmin && (
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setModalOpen(true)}>
            Đăng thông báo
          </Button>
        )}
      </Space>

      {announcements.length === 0 ? (
        <Empty description="Chưa có thông báo" />
      ) : (
        <List
          dataSource={announcements}
          renderItem={(item) => (
            <List.Item>
              <Card style={{ width: '100%' }} title={item.title} extra={
                <span style={{ color: '#999' }}>{new Date(item.createdAt).toLocaleDateString('vi-VN')}</span>
              }>
                <Paragraph>{item.content}</Paragraph>
                <small style={{ color: '#999' }}>Đăng bởi: {item.author?.fullName}</small>
              </Card>
            </List.Item>
          )}
        />
      )}

      <Modal title="Đăng thông báo mới" open={modalOpen} onCancel={() => setModalOpen(false)} footer={null}>
        <Form form={form} layout="vertical" onFinish={handleCreate}>
          <Form.Item name="title" label="Tiêu đề" rules={[{ required: true, message: 'Nhập tiêu đề' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="content" label="Nội dung" rules={[{ required: true, message: 'Nhập nội dung' }]}>
            <TextArea rows={6} />
          </Form.Item>
          <Button type="primary" htmlType="submit" block>Đăng thông báo</Button>
        </Form>
      </Modal>
    </div>
  );
};

export default Announcements;
