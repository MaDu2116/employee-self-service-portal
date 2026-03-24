import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { authService } from '../../src/services/authService';
import { userRepository } from '../../src/repositories/userRepository';
import { AppError } from '../../src/middleware/errorHandler';

jest.mock('../../src/repositories/userRepository');
jest.mock('../../src/config/database', () => ({}));

const mockUserRepo = userRepository as jest.Mocked<typeof userRepository>;

describe('authService', () => {
  beforeEach(() => jest.clearAllMocks());

  describe('login', () => {
    it('should throw error when email is empty', async () => {
      await expect(authService.login('', 'password')).rejects.toThrow(AppError);
      await expect(authService.login('', 'password')).rejects.toThrow('Email và mật khẩu không được để trống');
    });

    it('should throw error when user not found', async () => {
      mockUserRepo.findByEmail.mockResolvedValue(null);
      await expect(authService.login('test@test.com', 'pass')).rejects.toThrow('Email hoặc mật khẩu không đúng');
    });

    it('should throw error when password is wrong', async () => {
      mockUserRepo.findByEmail.mockResolvedValue({
        id: 1,
        email: 'test@test.com',
        password: await bcrypt.hash('correct', 10),
        fullName: 'Test',
        role: 'EMPLOYEE',
        phone: null,
        address: null,
        bankAccount: null,
        departmentId: null,
        position: null,
        managerId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      await expect(authService.login('test@test.com', 'wrong')).rejects.toThrow('Email hoặc mật khẩu không đúng');
    });

    it('should return token and user on successful login', async () => {
      const hashedPw = await bcrypt.hash('correct', 10);
      mockUserRepo.findByEmail.mockResolvedValue({
        id: 1,
        email: 'test@test.com',
        password: hashedPw,
        fullName: 'Test User',
        role: 'EMPLOYEE',
        phone: null,
        address: null,
        bankAccount: null,
        departmentId: null,
        position: null,
        managerId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const result = await authService.login('test@test.com', 'correct');
      expect(result.token).toBeDefined();
      expect(result.user.email).toBe('test@test.com');
      expect(result.user.fullName).toBe('Test User');

      const decoded = jwt.decode(result.token) as { userId: number; email: string; role: string };
      expect(decoded.userId).toBe(1);
      expect(decoded.role).toBe('EMPLOYEE');
    });
  });

  describe('register', () => {
    it('should throw error when required fields are missing', async () => {
      await expect(authService.register({ email: '', password: 'pass', fullName: 'Test' }))
        .rejects.toThrow('Email, mật khẩu và họ tên không được để trống');
    });

    it('should throw error when email already exists', async () => {
      mockUserRepo.findByEmail.mockResolvedValue({
        id: 1,
        email: 'exist@test.com',
        password: 'hashed',
        fullName: 'Existing',
        role: 'EMPLOYEE',
        phone: null,
        address: null,
        bankAccount: null,
        departmentId: null,
        position: null,
        managerId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await expect(authService.register({ email: 'exist@test.com', password: 'pass', fullName: 'Test' }))
        .rejects.toThrow('Email đã được sử dụng');
    });

    it('should create user with hashed password', async () => {
      mockUserRepo.findByEmail.mockResolvedValue(null);
      mockUserRepo.create.mockResolvedValue({
        id: 2,
        email: 'new@test.com',
        password: 'hashed',
        fullName: 'New User',
        role: 'EMPLOYEE',
        phone: null,
        address: null,
        bankAccount: null,
        departmentId: null,
        position: null,
        managerId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const result = await authService.register({ email: 'new@test.com', password: 'pass123', fullName: 'New User' });
      expect(result.email).toBe('new@test.com');
      expect(mockUserRepo.create).toHaveBeenCalledTimes(1);

      // Verify password was hashed (not stored plain)
      const createCall = mockUserRepo.create.mock.calls[0][0];
      expect(createCall.password).not.toBe('pass123');
    });
  });

  describe('hashPassword', () => {
    it('should return a hashed string', async () => {
      const hashed = await authService.hashPassword('test123');
      expect(hashed).not.toBe('test123');
      const isMatch = await bcrypt.compare('test123', hashed);
      expect(isMatch).toBe(true);
    });
  });
});
