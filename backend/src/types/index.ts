import { Request } from 'express';
import { Role } from '@prisma/client';

export interface AuthPayload {
  userId: number;
  email: string;
  role: Role;
}

export interface AuthRequest extends Request {
  user?: AuthPayload;
}

export interface PaginationQuery {
  page?: string;
  limit?: string;
}

export interface PayslipUploadBody {
  userId: string;
  month: string;
  year: string;
}

export interface ProfileUpdateBody {
  phone?: string;
  address?: string;
  bankAccount?: string;
}

export interface RequestCreateBody {
  type: string;
  details: string;
}

export interface RequestStatusUpdateBody {
  status: string;
  response?: string;
}

export interface PolicyCreateBody {
  title: string;
  category: string;
  content: string;
}

export interface AnnouncementCreateBody {
  title: string;
  content: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}
