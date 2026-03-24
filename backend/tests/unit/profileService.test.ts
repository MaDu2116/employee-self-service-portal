import { profileService } from '../../src/services/profileService';
import { userRepository } from '../../src/repositories/userRepository';

jest.mock('../../src/repositories/userRepository');
jest.mock('../../src/config/database', () => ({}));

const mockUserRepo = userRepository as jest.Mocked<typeof userRepository>;

describe('profileService', () => {
  beforeEach(() => jest.clearAllMocks());

  describe('getProfile', () => {
    it('should throw error when user not found', async () => {
      mockUserRepo.findById.mockResolvedValue(null);
      await expect(profileService.getProfile(999)).rejects.toThrow('Không tìm thấy người dùng');
    });

    it('should return user profile', async () => {
      const mockProfile = {
        id: 1,
        email: 'test@test.com',
        fullName: 'Test',
        role: 'EMPLOYEE' as const,
        phone: '0123456789',
        address: 'HCM',
        bankAccount: '123456',
        position: 'Dev',
        departmentId: 1,
        department: { id: 1, name: 'Tech' },
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockUserRepo.findById.mockResolvedValue(mockProfile);

      const result = await profileService.getProfile(1);
      expect(result.email).toBe('test@test.com');
    });
  });

  describe('updateProfile', () => {
    it('should throw error when user not found', async () => {
      mockUserRepo.findById.mockResolvedValue(null);
      await expect(profileService.updateProfile(999, { phone: '0123456789' }))
        .rejects.toThrow('Không tìm thấy người dùng');
    });

    it('should update profile successfully', async () => {
      mockUserRepo.findById.mockResolvedValue({
        id: 1, email: 'test@test.com', fullName: 'Test', role: 'EMPLOYEE' as const,
        phone: null, address: null, bankAccount: null, position: null, departmentId: null,
        department: null, createdAt: new Date(), updatedAt: new Date(),
      });
      mockUserRepo.updateProfile.mockResolvedValue({
        id: 1, email: 'test@test.com', fullName: 'Test', role: 'EMPLOYEE' as const,
        phone: '0123456789', address: null, bankAccount: null, position: null,
        department: null, updatedAt: new Date(),
      });

      const result = await profileService.updateProfile(1, { phone: '0123456789' });
      expect(result.phone).toBe('0123456789');
    });
  });
});
