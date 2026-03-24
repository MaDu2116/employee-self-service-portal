import React, { useEffect, useState } from 'react';
import { Table, Button, Typography, message, Modal, Upload, Form, InputNumber, Spin, Space } from 'antd';
import { DownloadOutlined, UploadOutlined } from '@ant-design/icons';
import { payslipApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import type { Payslip } from '../types';

const { Title } = Typography;

const Payslips: React.FC = () => {
  const { isHrAdmin } = useAuth();
  const [payslips, setPayslips] = useState<Payslip[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [form] = Form.useForm();

  const fetchPayslips = async () => {
    try {
      const res = await payslipApi.getAll();
      setPayslips(res.data.data || []);
    } catch { /* handled */ }
    setLoading(false);
  };

  useEffect(() => { fetchPayslips(); }, []);

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

  const handleUpload = async (values: { userId: number; month: number; year: number; file: { file: File } }) => {
    setUploading(true);
    const formData = new FormData();
    formData.append('userId', String(values.userId));
    formData.append('month', String(values.month));
    formData.append('year', String(values.year));
    formData.append('file', values.file.file);

    try {
      await payslipApi.upload(formData);
      message.success('Upload thành công');
      setUploadOpen(false);
      form.resetFields();
      fetchPayslips();
    } catch (error: unknown) {
      const err = error as { response?: { data?: { error?: string } } };
      message.error(err.response?.data?.error || 'Upload thất bại');
    }
    setUploading(false);
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
      <Space style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <Title level={4} style={{ margin: 0 }}>Phiếu lương</Title>
        {isHrAdmin && (
          <Button type="primary" icon={<UploadOutlined />} onClick={() => setUploadOpen(true)}>
            Upload phiếu lương
          </Button>
        )}
      </Space>

      <Table dataSource={payslips} columns={columns} rowKey="id" />

      <Modal title="Upload phiếu lương" open={uploadOpen} onCancel={() => setUploadOpen(false)} footer={null}>
        <Form form={form} layout="vertical" onFinish={handleUpload}>
          <Form.Item name="userId" label="ID Nhân viên" rules={[{ required: true, message: 'Nhập ID nhân viên' }]}>
            <InputNumber style={{ width: '100%' }} min={1} />
          </Form.Item>
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
          <Button type="primary" htmlType="submit" loading={uploading} block>Upload</Button>
        </Form>
      </Modal>
    </div>
  );
};

export default Payslips;
