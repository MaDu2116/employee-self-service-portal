export interface User {
  id: number;
  email: string;
  fullName: string;
  role: 'HR_ADMIN' | 'EMPLOYEE';
  phone?: string;
  address?: string;
  bankAccount?: string;
  position?: string;
  departmentId?: number;
  department?: { id: number; name: string };
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthData {
  token: string;
  user: Pick<User, 'id' | 'email' | 'fullName' | 'role'>;
}

export interface Payslip {
  id: number;
  userId: number;
  month: number;
  year: number;
  filePath: string;
  uploadedAt: string;
}

export interface Policy {
  id: number;
  title: string;
  category: string;
  content: string;
  filePath?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdminRequest {
  id: number;
  userId: number;
  type: 'WORK_CONFIRMATION' | 'CARD_REISSUE';
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  details: string;
  response?: string;
  createdAt: string;
  updatedAt: string;
  user?: { id: number; fullName: string; email: string };
}

export interface Announcement {
  id: number;
  title: string;
  content: string;
  authorId: number;
  createdAt: string;
  author?: { id: number; fullName: string };
}

export interface Department {
  id: number;
  name: string;
  parentId?: number;
  users: { id: number; fullName: string; position?: string; email: string }[];
  children?: Department[];
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}
