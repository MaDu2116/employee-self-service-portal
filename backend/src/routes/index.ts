import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { CONFIG } from '../config/constants';
import { authenticate } from '../middleware/authMiddleware';
import { requireRole } from '../middleware/roleMiddleware';
import { healthController } from '../controllers/healthController';
import { authController } from '../controllers/authController';
import { profileController } from '../controllers/profileController';
import { payslipController } from '../controllers/payslipController';
import { policyController } from '../controllers/policyController';
import { requestController } from '../controllers/requestController';
import { announcementController } from '../controllers/announcementController';
import { orgChartController } from '../controllers/orgChartController';

const router = Router();

// Multer config for PDF uploads
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, CONFIG.UPLOAD_DIR),
  filename: (_req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: CONFIG.MAX_FILE_SIZE },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Chỉ chấp nhận file PDF'));
    }
  },
});

// Health
router.get('/health', healthController.check);

// Auth
router.post('/api/auth/login', authController.login);
router.post('/api/auth/register', authenticate, requireRole('HR_ADMIN'), authController.register);

// Profile
router.get('/api/profile', authenticate, profileController.getProfile);
router.put('/api/profile', authenticate, profileController.updateProfile);

// Users (HR search)
router.get('/api/users/search', authenticate, requireRole('HR_ADMIN'), profileController.searchUsers);

// Payslips
router.get('/api/payslips', authenticate, payslipController.getMyPayslips);
router.get('/api/payslips/check', authenticate, requireRole('HR_ADMIN'), payslipController.checkExisting);
router.get('/api/payslips/user/:userId', authenticate, requireRole('HR_ADMIN'), payslipController.getPayslipsByUserId);
router.get('/api/payslips/:id/download', authenticate, payslipController.downloadPayslip);
router.post(
  '/api/payslips/upload',
  authenticate,
  requireRole('HR_ADMIN'),
  upload.single('file'),
  payslipController.uploadPayslip
);

// Policies
router.get('/api/policies/categories', authenticate, policyController.getCategories);
router.get('/api/policies/search', authenticate, policyController.search);
router.get('/api/policies', authenticate, policyController.getAll);
router.get('/api/policies/:id', authenticate, policyController.getById);
router.post('/api/policies', authenticate, requireRole('HR_ADMIN'), policyController.create);
router.put('/api/policies/:id', authenticate, requireRole('HR_ADMIN'), policyController.update);
router.delete('/api/policies/:id', authenticate, requireRole('HR_ADMIN'), policyController.delete);

// Admin Requests
router.get('/api/requests', authenticate, requestController.getRequests);
router.post('/api/requests', authenticate, requestController.createRequest);
router.put(
  '/api/requests/:id/status',
  authenticate,
  requireRole('HR_ADMIN'),
  requestController.updateStatus
);

// Announcements
router.get('/api/announcements', authenticate, announcementController.getAll);
router.post(
  '/api/announcements',
  authenticate,
  requireRole('HR_ADMIN'),
  announcementController.create
);

// Org Chart
router.get('/api/org-chart', authenticate, orgChartController.getOrgChart);

export default router;
