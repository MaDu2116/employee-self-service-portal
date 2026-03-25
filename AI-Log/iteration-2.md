# AI-Log: Iteration 2 - Bug Fixes & Payslip Redesign

**Ngày**: 2026-03-25
**Session**: CI/CD fixes, Docker runtime fixes, Payslip UX redesign

---

## Prompt Log

### Prompt 1: Fix TS5112 - seed compilation in CI/CD
> "Bug xảy ra trong quá trình CI/CD: error TS5112: tsconfig.json is present but will not be loaded if files are specified on commandline."

**Kết quả**: Thêm `--ignoreConfig` flag vào Dockerfile tsc command.

### Prompt 2: Fix TS5112 fallout - module resolution failure
> "Lỗi xảy ra ở CI/CD tại nhánh main"

**Kết quả**: `--ignoreConfig` gây mất moduleResolution → tạo `tsconfig.seed.json` riêng cho seed compilation.

### Prompt 3: Fix TS5011 + TS5107 - TS6 strict mode
> "Lỗi khi CI CD: TS5011 rootDir setting must be explicitly set, TS5107 moduleResolution=node10 deprecated"

**Kết quả**: Thêm `rootDir: "./prisma"` + `ignoreDeprecations: "6.0"` vào tsconfig.seed.json.

### Prompt 4: Fix missing migrations - tables not created
> "Lỗi khi thực hiện login: The table public.Department does not exist"

**Kết quả**: Generate initial Prisma migration bằng `prisma migrate diff --from-empty`, tạo `prisma/migrations/20260324000000_init/migration.sql`.

### Prompt 5: Payslip UX redesign
> "Tính năng hiện tại chưa hợp lý. Yêu cầu nhập ID nhân viên gây khó khăn cho admin..."

**Kết quả**: Redesign hoàn toàn Payslips page cho HR Admin:
- Backend: 3 API mới (user search, payslip by user, check existing)
- Frontend: Search employees → per-user upload → duplicate warning

### Prompt 6-8: Fix TS6133 unused variables
> "Lỗi CI/CD: TS6133 'Popconfirm' declared but never read, 'confirmUpload', 'handleConfirmDuplicate', 'pendingUpload'"

**Kết quả**: Xóa 4 unused imports/variables trong Payslips.tsx qua 2 iterations.

### Prompt 9: Comprehensive review + documentation
> "Tự review lại source, update markdown, vẽ sequence diagrams, review design pattern và security cho 2000 users"

**Kết quả**:
- Source review: frontend + backend compile clean, 51 tests pass
- CLAUDE.md: project guide + sequence diagrams (8 flows) + design pattern review + security review
- AI-Log/iteration-2.md: full session log
- Sequence diagrams: Login, Profile, Payslip Upload/Download, Policy, Requests, Announcements, OrgChart, Dashboard
- Design pattern review: 7 patterns identified (Layered, Repository, Middleware Chain, Singleton, Strategy, Observer, DTO)
- Security review: 7 recommendations for 2000 users (rate limiting, token security, input validation, file upload, DB pooling, logging, HTTPS)

---

## Tóm tắt công việc đã thực hiện

### CI/CD Fixes
| Lỗi | Nguyên nhân | Fix |
|------|------------|-----|
| TS5112 | TS6: tsconfig conflicts with CLI files | Tạo `tsconfig.seed.json` |
| TS5011 | TS6: missing explicit rootDir | `rootDir: "./prisma"` |
| TS5107 | TS6: moduleResolution "node" deprecated | `"node10"` + `ignoreDeprecations` |
| P2021 | Missing migrations folder | Generate initial migration |
| TS6133 x4 | Unused variables after refactor | Remove dead code |

### Feature: Payslip UX Redesign (HR Admin)
- **Trước**: HR nhập ID nhân viên thủ công, upload 2 phiếu khác ID cùng tháng bị lỗi trùng
- **Sau**: Search nhân viên → bảng kết quả → upload per-user → cảnh báo trùng lặp

### New API Endpoints
| Method | Endpoint | Mô tả |
|--------|----------|--------|
| GET | `/api/users/search?q=` | HR tìm nhân viên theo ID/tên/email |
| GET | `/api/payslips/user/:userId` | HR xem phiếu lương của nhân viên cụ thể |
| GET | `/api/payslips/check?userId&month&year` | Kiểm tra phiếu lương trùng lặp |

### Documentation
- `CLAUDE.md` — Project guide cho AI assistants
- `AI-Log/iteration-2.md` — Session log
- Sequence diagrams cho toàn bộ system actions
- Security & design pattern review cho 2000 users

---

## Kết quả

| Metric | Target | Actual |
|--------|--------|--------|
| Test coverage | ≥ 60% | 60.83% (unchanged) |
| Tests passing | All | 51/51 |
| CI/CD | Pass | Pass (after 5 fixes) |
| Docker runtime | Working | Working (migration + seed) |
| New APIs | 3 | 3 |
| Login working | Yes | Yes |

## Quy tắc cập nhật Changelog

Mỗi lần cập nhật **bắt buộc** ghi rõ 3 thông tin:

1. **Tên tính năng**: Tên chức năng hoặc thay đổi
2. **Files thay đổi**: Danh sách file đã thêm/sửa/xóa
3. **Cách hoạt động**: Mô tả ngắn gọn cách tính năng hoạt động

---

## Changelog

### [1.1.0] - 2026-03-25

**Tên tính năng**: Payslip UX redesign + CI/CD & Docker bug fixes

**Files thay đổi**:
- `backend/tsconfig.seed.json` — TẠO MỚI: config riêng cho seed compilation
- `backend/Dockerfile` — đổi sang `tsc -p tsconfig.seed.json`
- `backend/docker-entrypoint.sh` — fix seed path
- `backend/prisma/migrations/` — TẠO MỚI: initial migration
- `backend/src/controllers/payslipController.ts` — thêm getPayslipsByUserId, checkExisting
- `backend/src/controllers/profileController.ts` — thêm searchUsers
- `backend/src/repositories/userRepository.ts` — thêm searchUsers
- `backend/src/repositories/payslipRepository.ts` — thêm findByUserIdWithUser
- `backend/src/services/payslipService.ts` — thêm getPayslipsByUserId, checkExisting
- `backend/src/routes/index.ts` — 3 route mới
- `frontend/src/pages/Payslips.tsx` — redesign HR Admin view
- `frontend/src/services/api.ts` — thêm userApi, payslip APIs mới
- `CLAUDE.md` — TẠO MỚI: project guide + sequence diagrams + design/security review
- `AI-Log/iteration-2.md` — TẠO MỚI: session log
- `README.md` — cập nhật API endpoints mới + changelog v1.1.0

**Cách hoạt động**:
- CI/CD: tsconfig.seed.json compile seed riêng, initial migration tạo tables
- HR Admin: Search nhân viên → expandable rows xem phiếu lương → upload per-user → cảnh báo trùng
- Employee: Giữ nguyên giao diện cũ
- Documentation: 8 sequence diagrams (Mermaid), 7 design patterns reviewed, security audit cho 2000 users
