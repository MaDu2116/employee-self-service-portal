import React, { useEffect, useState } from 'react';
import { Table, Button, Typography, message, Modal, Form, Input, Select, Tag, Space, Spin } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { requestApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { AdminRequest } from '../types';

const { Title } = Typography;
const { TextArea } = Input;

const TYPE_LABELS: Record<string, string> = {
  WORK_CONFIRMATION: 'Xác nhận công tác',
  CARD_REISSUE: 'Cấp lại thẻ',
};

const STATUS_CONFIG: Record<string, { color: string; label: string }> = {
  PENDING: { color: 'orange', label: 'Chờ duyệt' },
  APPROVED: { color: 'green', label: 'Đã duyệt' },
  REJECTED: { color: 'red', label: 'Từ chối' },
};

const Requests: React.FC = () => {
  const { isHrAdmin } = useAuth();
  const [requests, setRequests] = useState<AdminRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);
  const [processOpen, setProcessOpen] = useState(false);
  const [selectedReq, setSelectedReq] = useState<AdminRequest | null>(null);
  const [form] = Form.useForm();
  const [processForm] = Form.useForm();

  const fetchRequests = async () => {
    try {
      const res = await requestApi.getAll();
      setRequests(res.data.data || []);
    } catch { /* handled */ }
    setLoading(false);
  };

  useEffect(() => { fetchRequests(); }, []);

  const handleCreate = async (values: { type: string; details: string }) => {
    try {
      await requestApi.create(values);
      message.success('Tạo yêu cầu thành công');
      setCreateOpen(false);
      form.resetFields();
      fetchRequests();
    } catch (error: unknown) {
      const err = error as { response?: { data?: { error?: string } } };
      message.error(err.response?.data?.error || 'Tạo yêu cầu thất bại');
    }
  };

  const handleProcess = async (values: { status: string; response?: string }) => {
    if (!selectedReq) return;
    try {
      await requestApi.updateStatus(selectedReq.id, values);
      message.success('Cập nhật trạng thái thành công');
      setProcessOpen(false);
      processForm.resetFields();
      fetchRequests();
    } catch (error: unknown) {
      const err = error as { response?: { data?: { error?: string } } };
      message.error(err.response?.data?.error || 'Cập nhật thất bại');
    }
  };

  const columns = [
    ...(isHrAdmin ? [{
      title: 'Nhân viên',
      key: 'user',
      render: (_: unknown, r: AdminRequest) => r.user?.fullName || '—',
    }] : []),
    {
      title: 'Loại yêu cầu',
      dataIndex: 'type',
      key: 'type',
      render: (v: string) => TYPE_LABELS[v] || v,
    },
    { title: 'Chi tiết', dataIndex: 'details', key: 'details', ellipsis: true },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (v: string) => <Tag color={STATUS_CONFIG[v]?.color}>{STATUS_CONFIG[v]?.label}</Tag>,
    },
    {
      title: 'Phản hồi',
      dataIndex: 'response',
      key: 'response',
      render: (v: string) => v || '—',
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (v: string) => new Date(v).toLocaleDateString('vi-VN'),
    },
    ...(isHrAdmin ? [{
      title: 'Thao tác',
      key: 'action',
      render: (_: unknown, record: AdminRequest) =>
        record.status === 'PENDING' ? (
          <Button type="link" onClick={() => { setSelectedReq(record); setProcessOpen(true); }}>
            Xử lý
          </Button>
        ) : null,
    }] : []),
  ];

  if (loading) return <Spin size="large" style={{ display: 'block', margin: '100px auto' }} />;

  return (
    <div>
      <Space style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <Title level={4} style={{ margin: 0 }}>Yêu cầu hành chính</Title>
        {!isHrAdmin && (
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setCreateOpen(true)}>
            Tạo yêu cầu
          </Button>
        )}
      </Space>

      <Table dataSource={requests} columns={columns} rowKey="id" />

      {/* Create Modal */}
      <Modal title="Tạo yêu cầu mới" open={createOpen} onCancel={() => setCreateOpen(false)} footer={null}>
        <Form form={form} layout="vertical" onFinish={handleCreate}>
          <Form.Item name="type" label="Loại yêu cầu" rules={[{ required: true, message: 'Chọn loại yêu cầu' }]}>
            <Select options={[
              { label: 'Xác nhận công tác', value: 'WORK_CONFIRMATION' },
              { label: 'Cấp lại thẻ', value: 'CARD_REISSUE' },
            ]} />
          </Form.Item>
          <Form.Item name="details" label="Chi tiết" rules={[{ required: true, message: 'Nhập chi tiết yêu cầu' }]}>
            <TextArea rows={4} />
          </Form.Item>
          <Button type="primary" htmlType="submit" block>Gửi yêu cầu</Button>
        </Form>
      </Modal>

      {/* Process Modal */}
      <Modal title="Xử lý yêu cầu" open={processOpen} onCancel={() => setProcessOpen(false)} footer={null}>
        <Form form={processForm} layout="vertical" onFinish={handleProcess}>
          <Form.Item name="status" label="Trạng thái" rules={[{ required: true, message: 'Chọn trạng thái' }]}>
            <Select options={[
              { label: 'Duyệt', value: 'APPROVED' },
              { label: 'Từ chối', value: 'REJECTED' },
            ]} />
          </Form.Item>
          <Form.Item name="response" label="Phản hồi">
            <TextArea rows={3} />
          </Form.Item>
          <Button type="primary" htmlType="submit" block>Cập nhật</Button>
        </Form>
      </Modal>
    </div>
  );
};

export default Requests;
