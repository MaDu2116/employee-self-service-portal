import React, { useEffect, useState } from 'react';
import { Card, Form, Input, Button, Typography, message, Descriptions, Spin, Space } from 'antd';
import { profileApi } from '../services/api';
import type { User } from '../types';

const { Title } = Typography;

const Profile: React.FC = () => {
  const [profile, setProfile] = useState<User | null>(null);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form] = Form.useForm();

  const fetchProfile = async () => {
    try {
      const res = await profileApi.get();
      setProfile(res.data.data);
      form.setFieldsValue(res.data.data);
    } catch { /* handled */ }
    setLoading(false);
  };

  useEffect(() => { fetchProfile(); }, []);

  const onSave = async (values: { phone?: string; address?: string; bankAccount?: string }) => {
    setSaving(true);
    try {
      const res = await profileApi.update(values);
      setProfile(res.data.data);
      setEditing(false);
      message.success('Cập nhật thành công');
    } catch (error: unknown) {
      const err = error as { response?: { data?: { error?: string } } };
      message.error(err.response?.data?.error || 'Cập nhật thất bại');
    }
    setSaving(false);
  };

  if (loading) return <Spin size="large" style={{ display: 'block', margin: '100px auto' }} />;

  return (
    <div>
      <Title level={4}>Hồ sơ cá nhân</Title>
      {!editing ? (
        <Card>
          <Descriptions column={{ xs: 1, sm: 2 }} bordered>
            <Descriptions.Item label="Họ tên">{profile?.fullName}</Descriptions.Item>
            <Descriptions.Item label="Email">{profile?.email}</Descriptions.Item>
            <Descriptions.Item label="Chức vụ">{profile?.position || '—'}</Descriptions.Item>
            <Descriptions.Item label="Phòng ban">{profile?.department?.name || '—'}</Descriptions.Item>
            <Descriptions.Item label="Điện thoại">{profile?.phone || '—'}</Descriptions.Item>
            <Descriptions.Item label="Địa chỉ">{profile?.address || '—'}</Descriptions.Item>
            <Descriptions.Item label="Tài khoản ngân hàng">{profile?.bankAccount || '—'}</Descriptions.Item>
          </Descriptions>
          <Button type="primary" onClick={() => setEditing(true)} style={{ marginTop: 16 }}>
            Chỉnh sửa
          </Button>
        </Card>
      ) : (
        <Card>
          <Form form={form} layout="vertical" onFinish={onSave}>
            <Form.Item name="phone" label="Điện thoại">
              <Input placeholder="Số điện thoại" />
            </Form.Item>
            <Form.Item name="address" label="Địa chỉ">
              <Input placeholder="Địa chỉ" />
            </Form.Item>
            <Form.Item name="bankAccount" label="Tài khoản ngân hàng">
              <Input placeholder="Số tài khoản ngân hàng" />
            </Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" loading={saving}>Lưu</Button>
              <Button onClick={() => setEditing(false)}>Hủy</Button>
            </Space>
          </Form>
        </Card>
      )}
    </div>
  );
};

export default Profile;
