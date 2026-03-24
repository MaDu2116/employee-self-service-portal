==========================================
  EMPLOYEE SELF-SERVICE PORTAL
  Huong dan su dung (Vietnamese)
==========================================

YEU CAU:
  - Docker Desktop da cai dat va dang chay
  - Khong can source code, khong can cai Node.js

------------------------------------------
CACH CHAY:
------------------------------------------

  Windows:  Nhan doi vao file "run.bat"
  Mac/Linux: Mo terminal, chay "./run.sh"

  Lan dau chay se mat 2-3 phut de pull images va khoi tao database.
  Cac lan sau se nhanh hon (chi mat ~15 giay).

------------------------------------------
TRUY CAP:
------------------------------------------

  Frontend:  http://localhost
  Backend:   http://localhost:3001
  Health:    http://localhost:3001/health

------------------------------------------
TAI KHOAN MAC DINH:
------------------------------------------

  HR Admin:
    Email:    admin@company.com
    Password: admin123

  Nhan vien 1:
    Email:    nv1@company.com
    Password: employee123

  Nhan vien 2:
    Email:    nv2@company.com
    Password: employee123

------------------------------------------
TUY CHINH:
------------------------------------------

  Mo file ".env" de thay doi:
  - FRONTEND_PORT: Port cho trang web (mac dinh: 80)
  - BACKEND_PORT:  Port cho API (mac dinh: 3001)
  - JWT_SECRET:    Secret key cho xac thuc
  - Database credentials

------------------------------------------
DUNG UNG DUNG:
------------------------------------------

  Windows:  Chay "stop.bat"
  Mac/Linux: Chay "./stop.sh"

------------------------------------------
XOA DU LIEU VA BAT DAU LAI:
------------------------------------------

  docker compose down -v
  (Lenh nay se xoa toan bo database va file upload)

==========================================
