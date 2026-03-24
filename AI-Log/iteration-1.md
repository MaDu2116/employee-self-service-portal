# AI-Log: Iteration 1 - Khởi tạo dự án

**Ngày**: 2026-03-24
**Session**: Initial project setup

---

## Prompt Log

### Prompt 1: Phân tích requirements
> "CHƯA CẦN CODE, đọc nội dung file requirements.txt tại repo employee-self-service-portal và phân tích yêu cầu, lên kế hoạch theo nội dung mô tả trong file."

**Kết quả**: Đọc và phân tích requirements.txt, tạo implementation plan chi tiết với tech stack, DB schema, API endpoints, project structure.

### Prompt 2: Bổ sung requirements Docker production
> "Add thêm các nội dung sau vào file Requirements có sẵn (convert sang vietnamese) và bổ sung vào plan. Bổ sung yêu cầu: Mọi prompt trong session này đều được lưu vào file AI log"

**Nội dung bổ sung**:
- Section 13: Docker & Production deployment (auto DB init, volume persist, prisma migrate deploy)
- Section 14: Required output files (docker-compose.yml, Dockerfile, run.bat)
- Section 15: Ràng buộc (simple setup, best practices)
- Section 16: AI-Log requirement

**Kết quả**: Cập nhật requirements.txt và plan file với nội dung Docker production-ready.

### Prompt 3: Bắt đầu coding
> "Plan trên được chấp thuận, hãy bắt đầu coding. Khi tạo file markdown, bắt buộc có yêu cầu: Quy tắc cập nhật Changelog và Changelog section."

**Kết quả**: Triển khai toàn bộ 4 phase của project.

---

## Tóm tắt công việc đã thực hiện

### Phase 1: Foundation
- Khởi tạo backend Express + TypeScript + Prisma
- Khởi tạo frontend Vite + React + TypeScript + Ant Design
- Thiết kế Prisma schema (User, Department, Payslip, Policy, AdminRequest, Announcement)
- Implement JWT auth + role-based middleware

### Phase 2: Core Features
- Profile API + UI (xem/cập nhật hồ sơ cá nhân)
- Payslips API + UI (HR upload PDF, employee xem/tải, kiểm tra ownership)
- Policies API + UI (CRUD, search, category filter)
- Requests API + UI (tạo, theo dõi, HR duyệt/từ chối)
- Announcements API + UI (HR đăng, employee xem)
- Org Chart API + UI (hiển thị sơ đồ tổ chức theo phòng ban)

### Phase 3: DevOps & Testing
- Docker Compose (PostgreSQL + Backend + Frontend/Nginx)
- Multi-stage Dockerfile (backend + frontend)
- docker-entrypoint.sh (auto migrate + seed + start)
- run.bat (Windows one-click)
- GitHub Actions CI/CD (test + build + push to GHCR)
- 51 unit tests + integration tests, coverage ≥ 60%
- Structured logging (Winston JSON)
- /health endpoint

### Phase 4: Documentation
- README.md đầy đủ (kiến trúc, setup, API docs, changelog rules)
- AI-Log/iteration-1.md (file này)

---

## Kết quả

| Metric | Target | Actual |
|--------|--------|--------|
| Test coverage | ≥ 60% | 60.83% |
| Tests passing | All | 51/51 |
| Core features | 6 | 6 |
| Advanced features | ≥ 1 | 2 (Dashboard stats, RBAC) |
| /health endpoint | Yes | Yes |
| Docker Compose | Yes | Yes |
| CI/CD pipeline | Yes | Yes |
| run.bat | Yes | Yes |

## Quy tắc cập nhật Changelog

Mỗi lần cập nhật **bắt buộc** ghi rõ 3 thông tin:

1. **Tên tính năng**: Tên chức năng hoặc thay đổi
2. **Files thay đổi**: Danh sách file đã thêm/sửa/xóa
3. **Cách hoạt động**: Mô tả ngắn gọn cách tính năng hoạt động

---

## Changelog

### [1.0.0] - 2026-03-24

**Tên tính năng**: Initial release - Employee Self-Service Portal

**Files thay đổi**:
- `backend/` - Toàn bộ backend (config, controllers, services, repositories, middleware, routes, types, prisma schema + seed, tests, Dockerfile)
- `frontend/` - Toàn bộ frontend (pages, components, services, context, types, Dockerfile, nginx.conf)
- `docker-compose.yml` - Docker orchestration
- `run.bat` - Windows one-click launcher
- `.github/workflows/ci.yml` - CI/CD pipeline
- `README.md` - Documentation
- `AI-Log/iteration-1.md` - Session log

**Cách hoạt động**:
- Backend Express API xử lý auth (JWT), CRUD cho 6 module, phân quyền HR_ADMIN/EMPLOYEE
- Frontend React SPA với routing, AntD components, axios interceptor tự động attach token
- Docker Compose khởi động 3 services, auto migrate DB, seed data mặc định
- CI/CD: push main → test → build images → push GHCR
