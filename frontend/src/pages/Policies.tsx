import React, { useEffect, useState } from 'react';
import { Card, Input, Select, Typography, List, Tag, Button, Modal, Form, message, Spin, Space, Empty } from 'antd';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { policyApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import type { Policy } from '../types';

const { Title, Paragraph } = Typography;
const { TextArea } = Input;

const Policies: React.FC = () => {
  const { isHrAdmin } = useAuth();
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>();
  const [searchKeyword, setSearchKeyword] = useState('');
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedPolicy, setSelectedPolicy] = useState<Policy | null>(null);
  const [form] = Form.useForm();

  const fetchPolicies = async (category?: string) => {
    setLoading(true);
    try {
      const res = await policyApi.getAll(category);
      setPolicies(res.data.data || []);
    } catch { /* handled */ }
    setLoading(false);
  };

  const fetchCategories = async () => {
    try {
      const res = await policyApi.getCategories();
      setCategories(res.data.data || []);
    } catch { /* handled */ }
  };

  useEffect(() => {
    fetchPolicies();
    fetchCategories();
  }, []);

  const handleSearch = async () => {
    if (!searchKeyword.trim()) {
      fetchPolicies(selectedCategory);
      return;
    }
    setLoading(true);
    try {
      const res = await policyApi.search(searchKeyword);
      setPolicies(res.data.data || []);
    } catch { /* handled */ }
    setLoading(false);
  };

  const handleCategoryChange = (value: string | undefined) => {
    setSelectedCategory(value);
    setSearchKeyword('');
    fetchPolicies(value);
  };

  const handleCreate = async (values: { title: string; category: string; content: string }) => {
    try {
      await policyApi.create(values);
      message.success('Tạo chính sách thành công');
      setModalOpen(false);
      form.resetFields();
      fetchPolicies(selectedCategory);
      fetchCategories();
    } catch (error: unknown) {
      const err = error as { response?: { data?: { error?: string } } };
      message.error(err.response?.data?.error || 'Tạo thất bại');
    }
  };

  return (
    <div>
      <Space style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <Title level={4} style={{ margin: 0 }}>Chính sách công ty</Title>
        {isHrAdmin && (
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setModalOpen(true)}>
            Thêm chính sách
          </Button>
        )}
      </Space>

      <Space style={{ marginBottom: 16 }} wrap>
        <Select
          placeholder="Lọc theo danh mục"
          allowClear
          style={{ width: 200 }}
          onChange={handleCategoryChange}
          options={categories.map((c) => ({ label: c, value: c }))}
        />
        <Input.Search
          placeholder="Tìm kiếm chính sách..."
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          onSearch={handleSearch}
          enterButton={<SearchOutlined />}
          style={{ width: 300 }}
        />
      </Space>

      {loading ? (
        <Spin size="large" style={{ display: 'block', margin: '50px auto' }} />
      ) : policies.length === 0 ? (
        <Empty description="Không có chính sách nào" />
      ) : (
        <List
          grid={{ gutter: 16, xs: 1, sm: 2, lg: 3 }}
          dataSource={policies}
          renderItem={(item) => (
            <List.Item>
              <Card
                hoverable
                title={item.title}
                extra={<Tag color="blue">{item.category}</Tag>}
                onClick={() => { setSelectedPolicy(item); setDetailOpen(true); }}
              >
                <Paragraph ellipsis={{ rows: 3 }}>{item.content}</Paragraph>
                <small style={{ color: '#999' }}>
                  {new Date(item.createdAt).toLocaleDateString('vi-VN')}
                </small>
              </Card>
            </List.Item>
          )}
        />
      )}

      {/* Detail Modal */}
      <Modal
        title={selectedPolicy?.title}
        open={detailOpen}
        onCancel={() => setDetailOpen(false)}
        footer={null}
        width={600}
      >
        {selectedPolicy && (
          <>
            <Tag color="blue" style={{ marginBottom: 12 }}>{selectedPolicy.category}</Tag>
            <Paragraph>{selectedPolicy.content}</Paragraph>
            <small style={{ color: '#999' }}>
              Cập nhật: {new Date(selectedPolicy.updatedAt).toLocaleDateString('vi-VN')}
            </small>
          </>
        )}
      </Modal>

      {/* Create Modal */}
      <Modal title="Thêm chính sách mới" open={modalOpen} onCancel={() => setModalOpen(false)} footer={null}>
        <Form form={form} layout="vertical" onFinish={handleCreate}>
          <Form.Item name="title" label="Tiêu đề" rules={[{ required: true, message: 'Nhập tiêu đề' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="category" label="Danh mục" rules={[{ required: true, message: 'Nhập danh mục' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="content" label="Nội dung" rules={[{ required: true, message: 'Nhập nội dung' }]}>
            <TextArea rows={6} />
          </Form.Item>
          <Button type="primary" htmlType="submit" block>Tạo chính sách</Button>
        </Form>
      </Modal>
    </div>
  );
};

export default Policies;
