import React, { useEffect, useState, useCallback } from 'react';
import {
  Table, Button, Typography, message, Modal, Upload, Form,
  InputNumber, Spin, Space, Input, Card, Tag, Popconfirm,
} from 'antd';
import {
  DownloadOutlined, UploadOutlined, SearchOutlined,
} from '@ant-design/icons';
import { payslipApi, userApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import type { Payslip } from '../types';

const { Title, Text } = Typography;

interface SearchUser {
  id: number;
  email: string;
  fullName: string;
  role: string;
  position?: string;
  department?: { id: number; name: string };
}

interface UserPayslip extends Payslip {
  user?: { id: number; fullName: string; email: string };
}

// ====== Employee View (unchanged) ======
const EmployeePayslips: React.FC = () => {
  const [payslips, setPayslips] = useState<Payslip[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    payslipApi.getAll()
      .then((res) => setPayslips(res.data.data || []))
      .catch(() => {/* handled */})
      .finally(() => setLoading(false));
  }, []);

  const handleDownload = async (record: Payslip) => {
    try {
      const res = await payslipApi.download(record.id);
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.download = `payslip_${record.month}_${record.year}.pdf`;
      link.click();
      window.URL.revokeObjectURL(url);
    } catch {
      message.error('Không thể tải phiếu lương');
    }
  };

  const columns = [
    { title: 'Tháng', dataIndex: 'month', key: 'month' },
    { title: 'Năm', dataIndex: 'year', key: 'year' },
    {
      title: 'Ngày upload',
      dataIndex: 'uploadedAt',
      key: 'uploadedAt',
      render: (v: string) => new Date(v).toLocaleDateString('vi-VN'),
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_: unknown, record: Payslip) => (
        <Button icon={<DownloadOutlined />} onClick={() => handleDownload(record)} type="link">
          Tải xuống
        </Button>
      ),
    },
  ];

  if (loading) return <Spin size="large" style={{ display: 'block', margin: '100px auto' }} />;

  return (
    <div>
      <Title level={4} style={{ marginBottom: 16 }}>Phiếu lương</Title>
      <Table dataSource={payslips} columns={columns} rowKey="id" />
    </div>
  );
};

// ====== HR Admin View ======
const HrPayslips: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState<SearchUser[]>([]);
  const [searching, setSearching] = useState(false);
  const [uploadModal, setUploadModal] = useState<{ open: boolean; user: SearchUser | null }>({ open: false, user: null });
  const [uploading, setUploading] = useState(false);
  const [duplicateWarning, setDuplicateWarning] = useState(false);
  const [confirmUpload, setConfirmUpload] = useState(false);
  const [pendingUpload, setPendingUpload] = useState<FormData | null>(null);
  const [userPayslips, setUserPayslips] = useState<Record<number, UserPayslip[]>>({});
  const [expandedRowKeys, setExpandedRowKeys] = useState<number[]>([]);
  const [form] = Form.useForm();

  const handleSearch = useCallback(async () => {
    if (!searchQuery.trim()) return;
    setSearching(true);
    try {
      const res = await userApi.search(searchQuery.trim());
      setUsers(res.data.data || []);
    } catch {
      message.error('Tìm kiếm thất bại');
    }
    setSearching(false);
  }, [searchQuery]);

  const loadUserPayslips = async (userId: number) => {
    try {
      const res = await payslipApi.getByUserId(userId);
      setUserPayslips((prev) => ({ ...prev, [userId]: res.data.data || [] }));
    } catch {
      message.error('Không thể tải phiếu lương');
    }
  };

  const handleExpandRow = (expanded: boolean, record: SearchUser) => {
    if (expanded) {
      setExpandedRowKeys((prev) => [...prev, record.id]);
      loadUserPayslips(record.id);
    } else {
      setExpandedRowKeys((prev) => prev.filter((k) => k !== record.id));
    }
  };

  const handleDownload = async (record: UserPayslip) => {
    try {
      const res = await payslipApi.download(record.id);
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.download = `payslip_${record.userId}_${record.month}_${record.year}.pdf`;
      link.click();
      window.URL.revokeObjectURL(url);
    } catch {
      message.error('Không thể tải phiếu lương');
    }
  };

  const openUploadModal = (user: SearchUser) => {
    setUploadModal({ open: true, user });
    setDuplicateWarning(false);
    setConfirmUpload(false);
    setPendingUpload(null);
    form.resetFields();
    form.setFieldsValue({
      month: new Date().getMonth() + 1,
      year: new Date().getFullYear(),
    });
  };

  const doUpload = async (formData: FormData) => {
    setUploading(true);
    try {
      await payslipApi.upload(formData);
      message.success('Upload thành công');
      setUploadModal({ open: false, user: null });
      form.resetFields();
      setDuplicateWarning(false);
      setConfirmUpload(false);
      setPendingUpload(null);
      if (uploadModal.user) {
        loadUserPayslips(uploadModal.user.id);
      }
    } catch (error: unknown) {
      const err = error as { response?: { data?: { error?: string } } };
      message.error(err.response?.data?.error || 'Upload thất bại');
    }
    setUploading(false);
  };

  const handleUpload = async (values: { month: number; year: number; file: { file: File } }) => {
    if (!uploadModal.user) return;

    const formData = new FormData();
    formData.append('userId', String(uploadModal.user.id));
    formData.append('month', String(values.month));
    formData.append('year', String(values.year));
    formData.append('file', values.file.file);

    // Check for existing payslip
    try {
      const check = await payslipApi.checkExisting(uploadModal.user.id, values.month, values.year);
      if (check.data.data?.exists) {
        setDuplicateWarning(true);
        setPendingUpload(formData);
        return;
      }
    } catch {
      // If check fails, proceed anyway
    }

    await doUpload(formData);
  };

  const handleConfirmDuplicate = async () => {
    if (!pendingUpload) return;
    setConfirmUpload(true);
    await doUpload(pendingUpload);
  };

  const userColumns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 70 },
    { title: 'Họ tên', dataIndex: 'fullName', key: 'fullName' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    {
      title: 'Phòng ban',
      key: 'department',
      render: (_: unknown, record: SearchUser) =>
        record.department ? <Tag color="blue">{record.department.name}</Tag> : '-',
    },
    { title: 'Chức vụ', dataIndex: 'position', key: 'position', render: (v: string) => v || '-' },
    {
      title: 'Thao tác',
      key: 'action',
      width: 180,
      render: (_: unknown, record: SearchUser) => (
        <Button
          type="primary"
          icon={<UploadOutlined />}
          size="small"
          onClick={(e) => { e.stopPropagation(); openUploadModal(record); }}
        >
          Upload phiếu lương
        </Button>
      ),
    },
  ];

  const payslipColumns = [
    { title: 'Tháng', dataIndex: 'month', key: 'month', width: 80 },
    { title: 'Năm', dataIndex: 'year', key: 'year', width: 80 },
    {
      title: 'Ngày upload',
      dataIndex: 'uploadedAt',
      key: 'uploadedAt',
      render: (v: string) => new Date(v).toLocaleDateString('vi-VN'),
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 120,
      render: (_: unknown, record: UserPayslip) => (
        <Button icon={<DownloadOutlined />} onClick={() => handleDownload(record)} type="link" size="small">
          Tải xuống
        </Button>
      ),
    },
  ];

  return (
    <div>
      <Title level={4} style={{ marginBottom: 16 }}>Quản lý phiếu lương</Title>

      <Card style={{ marginBottom: 16 }}>
        <Space.Compact style={{ width: '100%' }}>
          <Input
            placeholder="Tìm kiếm nhân viên theo ID, tên hoặc email..."
            prefix={<SearchOutlined />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onPressEnter={handleSearch}
            allowClear
            size="large"
          />
          <Button type="primary" onClick={handleSearch} loading={searching} size="large">
            Tìm kiếm
          </Button>
        </Space.Compact>
      </Card>

      <Table
        dataSource={users}
        columns={userColumns}
        rowKey="id"
        loading={searching}
        expandable={{
          expandedRowKeys,
          onExpand: handleExpandRow,
          expandedRowRender: (record) => (
            <div style={{ padding: '8px 0' }}>
              <Text strong style={{ marginBottom: 8, display: 'block' }}>
                Phiếu lương của {record.fullName}:
              </Text>
              <Table
                dataSource={userPayslips[record.id] || []}
                columns={payslipColumns}
                rowKey="id"
                size="small"
                pagination={false}
                locale={{ emptyText: 'Chưa có phiếu lương' }}
              />
            </div>
          ),
        }}
        locale={{ emptyText: 'Nhập từ khóa để tìm kiếm nhân viên' }}
      />

      <Modal
        title={`Upload phiếu lương - ${uploadModal.user?.fullName || ''}`}
        open={uploadModal.open}
        onCancel={() => { setUploadModal({ open: false, user: null }); setDuplicateWarning(false); }}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleUpload}>
          <Form.Item name="month" label="Tháng" rules={[{ required: true, message: 'Chọn tháng' }]}>
            <InputNumber style={{ width: '100%' }} min={1} max={12} />
          </Form.Item>
          <Form.Item name="year" label="Năm" rules={[{ required: true, message: 'Chọn năm' }]}>
            <InputNumber style={{ width: '100%' }} min={2000} max={2100} />
          </Form.Item>
          <Form.Item name="file" label="File PDF" rules={[{ required: true, message: 'Chọn file' }]}>
            <Upload beforeUpload={() => false} accept=".pdf" maxCount={1}>
              <Button icon={<UploadOutlined />}>Chọn file PDF</Button>
            </Upload>
          </Form.Item>

          {duplicateWarning && (
            <div style={{ marginBottom: 16, padding: 12, background: '#fff7e6', border: '1px solid #ffd591', borderRadius: 6 }}>
              <Text type="warning" strong>
                ⚠ Phiếu lương cho nhân viên này trong tháng/năm đã chọn đã tồn tại.
              </Text>
              <br />
              <Text type="secondary">Upload sẽ bị từ chối do trùng lặp. Vui lòng chọn tháng/năm khác.</Text>
            </div>
          )}

          {!duplicateWarning ? (
            <Button type="primary" htmlType="submit" loading={uploading} block>
              Upload
            </Button>
          ) : (
            <Button block onClick={() => { setDuplicateWarning(false); }}>
              Chọn tháng/năm khác
            </Button>
          )}
        </Form>
      </Modal>
    </div>
  );
};

// ====== Main Component ======
const Payslips: React.FC = () => {
  const { isHrAdmin } = useAuth();
  return isHrAdmin ? <HrPayslips /> : <EmployeePayslips />;
};

export default Payslips;
