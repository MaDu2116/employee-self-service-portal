import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import viVN from 'antd/locale/vi_VN';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import AppLayout from './components/Layout/AppLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Payslips from './pages/Payslips';
import Policies from './pages/Policies';
import Requests from './pages/Requests';
import Announcements from './pages/Announcements';
import OrgChart from './pages/OrgChart';

function App() {
  return (
    <ConfigProvider locale={viVN}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
              <Route index element={<Dashboard />} />
              <Route path="profile" element={<Profile />} />
              <Route path="payslips" element={<Payslips />} />
              <Route path="policies" element={<Policies />} />
              <Route path="requests" element={<Requests />} />
              <Route path="announcements" element={<Announcements />} />
              <Route path="org-chart" element={<OrgChart />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ConfigProvider>
  );
}

export default App;
