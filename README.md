# Employee Self-Service Portal (ESS Portal)

Cổng tự phục vụ cho nhân viên - tra cứu thông tin hợp đồng, phiếu lương, chính sách công ty mà không cần liên hệ HR.

## Kiến trúc hệ thống

```
┌─────────────────────────────────────────────────────┐
│                   Docker Compose                     │
│                                                      │
│  ┌──────────┐    ┌──────────────┐    ┌───────────┐  │
│  │ Frontend │───▶│   Backend    │───▶│ PostgreSQL │  │
│  │ (Nginx)  │    │ (Express.js) │    │    (DB)    │  │
│  │ Port: 80 │    │ Port: 3001   │    │ Port: 5432 │  │
│  └──────────┘    └──────────────┘    └───────────┘  │
│       │                │                    │        │
│       │          ┌─────┴─────┐        ┌────┴────┐   │
│       │          │  Prisma   │        │ Volume  │   │
│       │          │   ORM     │        │ pgdata  │   │
│       │          └───────────┘        └─────────┘   │
│  React + AntD    JWT Auth + RBAC                     │
│  react-pdf       Winston Logger                      │
│  org-chart       Multer (PDF upload)                 │
└─────────────────────────────────────────────────────┘
```

### Cấu trúc Layer (Backend)

```
Controllers (API) → Services (Business Logic) → Repositories (Data Access) → Prisma (DB)
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + TypeScript + Vite + Ant Design |
| Backend | Node.js + Express + TypeScript |
| Database | PostgreSQL 15 |
| ORM | Prisma 5 |
| Auth | JWT + bcryptjs |
| Containerization | Docker + Docker Compose |
| CI/CD | GitHub Actions |

## Tính năng

### Core
- **Hồ sơ cá nhân**: Xem và cập nhật thông tin (điện thoại, địa chỉ, tài khoản ngân hàng)
- **Phiếu lương**: HR upload PDF, nhân viên xem phiếu của mình (bảo mật ownership)
- **Chính sách công ty**: Phân loại theo danh mục, tìm kiếm full-text
- **Yêu cầu hành chính**: Xin xác nhận công tác, cấp lại thẻ - theo dõi trạng thái
- **Thông báo nội bộ**: HR/Ban giám đốc đăng, nhân viên xem
- **Sơ đồ tổ chức**: Hiển thị org chart theo phòng ban

### Nâng cao
- **Dashboard thống kê**: Tổng quan yêu cầu, thông báo mới nhất
- **Phân quyền RBAC**: HR Admin vs Employee

## Hướng dẫn chạy

### Cách 1: Docker (Khuyến nghị)

**Yêu cầu**: Docker Desktop đã cài đặt

**Windows**: Chạy file `run.bat`

**Linux/Mac**:
```bash
docker compose up -d --build
```

Truy cập: http://localhost

### Cách 2: Development (Local)

```bash
# Terminal 1: Backend
cd backend
cp .env.example .env
npm install --legacy-peer-deps
npx prisma generate
npx prisma migrate dev
npx prisma db seed
npm run dev

# Terminal 2: Frontend
cd frontend
npm install
npm run dev
```

### Tài khoản mặc định

| Role | Email | Password |
|------|-------|----------|
| HR Admin | admin@company.com | admin123 |
| Employee | nv1@company.com | employee123 |
| Employee | nv2@company.com | employee123 |

## API Endpoints

| Method | Endpoint | Mô tả | Auth |
|--------|----------|--------|------|
| GET | `/health` | Health check | No |
| POST | `/api/auth/login` | Đăng nhập | No |
| POST | `/api/auth/register` | Tạo tài khoản | HR Admin |
| GET | `/api/profile` | Xem hồ sơ | All |
| PUT | `/api/profile` | Cập nhật hồ sơ | All |
| GET | `/api/payslips` | Danh sách phiếu lương | All |
| GET | `/api/payslips/:id/download` | Tải phiếu lương | Owner/HR |
| POST | `/api/payslips/upload` | Upload phiếu lương | HR Admin |
| GET | `/api/policies` | Danh sách chính sách | All |
| GET | `/api/policies/search?q=` | Tìm kiếm chính sách | All |
| POST | `/api/policies` | Tạo chính sách | HR Admin |
| PUT | `/api/policies/:id` | Sửa chính sách | HR Admin |
| GET | `/api/requests` | Danh sách yêu cầu | All |
| POST | `/api/requests` | Tạo yêu cầu | Employee |
| PUT | `/api/requests/:id/status` | Duyệt/từ chối yêu cầu | HR Admin |
| GET | `/api/announcements` | Danh sách thông báo | All |
| POST | `/api/announcements` | Đăng thông báo | HR Admin |
| GET | `/api/org-chart` | Sơ đồ tổ chức | All |

## Cấu trúc thư mục

```
employee-self-service-portal/
├── AI-Log/                    # Prompt logs & iteration summaries
├── backend/
│   ├── src/
│   │   ├── config/            # Database, constants, logger
│   │   ├── controllers/       # API layer
│   │   ├── services/          # Business logic
│   │   ├── repositories/      # Data access
│   │   ├── middleware/        # Auth, error handling
│   │   ├── routes/            # Route definitions
│   │   └── types/             # TypeScript interfaces
│   ├── prisma/                # Schema + migrations + seed
│   ├── tests/                 # Unit + integration tests
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── components/        # Layout, ProtectedRoute
│   │   ├── pages/             # All page components
│   │   ├── services/          # API client (axios)
│   │   ├── context/           # AuthContext
│   │   └── types/             # TypeScript types
│   └── Dockerfile
├── docker-compose.yml
├── run.bat
├── .github/workflows/ci.yml
└── README.md
```

## Testing

```bash
cd backend
npm run test:coverage
```

Coverage: ≥60% (services layer: ~90%)

## CI/CD

GitHub Actions pipeline:
1. **On push/PR to main**: Chạy tests + coverage
2. **On push to main**: Build Docker images → Push to GHCR

## Quy ước code

### Quy tắc cập nhật Changelog

Mỗi lần cập nhật **bắt buộc** ghi rõ 3 thông tin:

1. **Tên tính năng**: Tên chức năng hoặc thay đổi
2. **Files thay đổi**: Danh sách file đã thêm/sửa/xóa
3. **Cách hoạt động**: Mô tả ngắn gọn cách tính năng hoạt động

---

## Changelog

### [1.0.0] - 2026-03-24

**Tên tính năng**: Initial release - Employee Self-Service Portal

**Files thay đổi**:
- `backend/` - Toàn bộ backend API (Express + TypeScript + Prisma)
- `frontend/` - Toàn bộ frontend SPA (React + AntD + Vite)
- `docker-compose.yml`, `run.bat` - Docker deployment
- `.github/workflows/ci.yml` - CI/CD pipeline
- `AI-Log/iteration-1.md` - Session log

**Cách hoạt động**:
- Backend: Express API với JWT auth, phân quyền HR_ADMIN/EMPLOYEE, Prisma ORM
- Frontend: React SPA với AntD UI, axios API client, react-router routing
- 6 chức năng core: Profile, Payslips, Policies, Requests, Announcements, OrgChart
- Docker Compose: 3 services (PostgreSQL, Backend, Frontend/Nginx)
- Auto migration + seed khi lần đầu chạy, data persist qua Docker volumes
