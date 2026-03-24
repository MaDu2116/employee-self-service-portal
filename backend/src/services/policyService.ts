import { policyRepository } from '../repositories/policyRepository';
import { AppError } from '../middleware/errorHandler';
import { PolicyCreateBody } from '../types';

export const policyService = {
  getAllPolicies: async (category?: string) => {
    return policyRepository.findAll(category);
  },

  getPolicyById: async (id: number) => {
    const policy = await policyRepository.findById(id);
    if (!policy) {
      throw new AppError(404, 'Không tìm thấy chính sách');
    }
    return policy;
  },

  searchPolicies: async (keyword: string) => {
    if (!keyword || keyword.trim().length === 0) {
      throw new AppError(400, 'Từ khóa tìm kiếm không được để trống');
    }
    return policyRepository.search(keyword.trim());
  },

  createPolicy: async (data: PolicyCreateBody) => {
    if (!data.title || !data.category || !data.content) {
      throw new AppError(400, 'Tiêu đề, danh mục và nội dung không được để trống');
    }
    return policyRepository.create(data);
  },

  updatePolicy: async (id: number, data: Partial<PolicyCreateBody>) => {
    const existing = await policyRepository.findById(id);
    if (!existing) {
      throw new AppError(404, 'Không tìm thấy chính sách');
    }
    return policyRepository.update(id, data);
  },

  deletePolicy: async (id: number) => {
    const existing = await policyRepository.findById(id);
    if (!existing) {
      throw new AppError(404, 'Không tìm thấy chính sách');
    }
    return policyRepository.delete(id);
  },

  getCategories: async () => {
    const result = await policyRepository.getCategories();
    return result.map((r) => r.category);
  },
};
