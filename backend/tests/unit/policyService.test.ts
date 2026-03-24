import { policyService } from '../../src/services/policyService';
import { policyRepository } from '../../src/repositories/policyRepository';

jest.mock('../../src/repositories/policyRepository');
jest.mock('../../src/config/database', () => ({}));

const mockPolicyRepo = policyRepository as jest.Mocked<typeof policyRepository>;

describe('policyService', () => {
  beforeEach(() => jest.clearAllMocks());

  describe('getAllPolicies', () => {
    it('should return all policies', async () => {
      mockPolicyRepo.findAll.mockResolvedValue([]);
      const result = await policyService.getAllPolicies();
      expect(result).toEqual([]);
      expect(mockPolicyRepo.findAll).toHaveBeenCalledWith(undefined);
    });

    it('should filter by category', async () => {
      mockPolicyRepo.findAll.mockResolvedValue([]);
      await policyService.getAllPolicies('HR');
      expect(mockPolicyRepo.findAll).toHaveBeenCalledWith('HR');
    });
  });

  describe('searchPolicies', () => {
    it('should throw error for empty keyword', async () => {
      await expect(policyService.searchPolicies('')).rejects.toThrow('Từ khóa tìm kiếm không được để trống');
    });

    it('should search with trimmed keyword', async () => {
      mockPolicyRepo.search.mockResolvedValue([]);
      await policyService.searchPolicies('  phép  ');
      expect(mockPolicyRepo.search).toHaveBeenCalledWith('phép');
    });
  });

  describe('createPolicy', () => {
    it('should throw error when title is missing', async () => {
      await expect(policyService.createPolicy({ title: '', category: 'HR', content: 'Test' }))
        .rejects.toThrow('Tiêu đề, danh mục và nội dung không được để trống');
    });

    it('should create policy successfully', async () => {
      const mockPolicy = {
        id: 1,
        title: 'Test Policy',
        category: 'HR',
        content: 'Content',
        filePath: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockPolicyRepo.create.mockResolvedValue(mockPolicy);

      const result = await policyService.createPolicy({ title: 'Test Policy', category: 'HR', content: 'Content' });
      expect(result.title).toBe('Test Policy');
    });
  });

  describe('deletePolicy', () => {
    it('should throw error when policy not found', async () => {
      mockPolicyRepo.findById.mockResolvedValue(null);
      await expect(policyService.deletePolicy(999)).rejects.toThrow('Không tìm thấy chính sách');
    });
  });

  describe('getCategories', () => {
    it('should return category list', async () => {
      mockPolicyRepo.getCategories.mockResolvedValue([
        { category: 'HR' },
        { category: 'IT' },
      ] as Array<{ category: string }>);

      const result = await policyService.getCategories();
      expect(result).toEqual(['HR', 'IT']);
    });
  });
});
