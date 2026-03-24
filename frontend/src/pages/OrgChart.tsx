import React, { useEffect, useState } from 'react';
import { Typography, Spin, Card, Tag } from 'antd';
import { Tree, TreeNode } from 'react-organizational-chart';
import { orgChartApi } from '../services/api';
import { Department } from '../types';

const { Title } = Typography;

const DeptNode: React.FC<{ dept: Department }> = ({ dept }) => (
  <Card size="small" style={{ display: 'inline-block', minWidth: 150 }}>
    <strong>{dept.name}</strong>
    {dept.users.map((u) => (
      <div key={u.id} style={{ fontSize: 12, marginTop: 4 }}>
        {u.fullName} {u.position && <Tag style={{ fontSize: 10 }}>{u.position}</Tag>}
      </div>
    ))}
  </Card>
);

const RenderTreeNode: React.FC<{ dept: Department }> = ({ dept }) => (
  <TreeNode label={<DeptNode dept={dept} />}>
    {dept.children?.map((child) => (
      <RenderTreeNode key={child.id} dept={child} />
    ))}
  </TreeNode>
);

const OrgChartPage: React.FC = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrgChart = async () => {
      try {
        const res = await orgChartApi.get();
        setDepartments(res.data.data || []);
      } catch { /* handled */ }
      setLoading(false);
    };
    fetchOrgChart();
  }, []);

  if (loading) return <Spin size="large" style={{ display: 'block', margin: '100px auto' }} />;

  return (
    <div>
      <Title level={4}>Sơ đồ tổ chức</Title>
      <div style={{ overflow: 'auto', padding: 24 }}>
        {departments.map((root) => (
          <Tree key={root.id} label={<DeptNode dept={root} />} lineWidth="2px" lineColor="#1890ff" lineBorderRadius="10px">
            {root.children?.map((child) => (
              <RenderTreeNode key={child.id} dept={child} />
            ))}
          </Tree>
        ))}
      </div>
    </div>
  );
};

export default OrgChartPage;
