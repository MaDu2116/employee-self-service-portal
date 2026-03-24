#!/bin/bash
echo "=========================================="
echo "  Employee Self-Service Portal"
echo "=========================================="
echo ""

echo "[1/3] Pulling latest images..."
docker compose pull
if [ $? -ne 0 ]; then
    echo ""
    echo "LỖI: Không thể pull images. Kiểm tra Docker đã chạy chưa."
    exit 1
fi
echo ""

echo "[2/3] Starting all services..."
docker compose up -d
echo ""

echo "[3/3] Waiting for services to initialize..."
sleep 15
echo ""

echo "=========================================="
echo "  Application is running!"
echo ""
echo "  Frontend: http://localhost"
echo "  Backend:  http://localhost:3001"
echo "  Health:   http://localhost:3001/health"
echo "=========================================="
echo ""
echo "  Tài khoản mặc định:"
echo "  HR Admin:  admin@company.com / admin123"
echo "  Nhân viên: nv1@company.com   / employee123"
echo "  Nhân viên: nv2@company.com   / employee123"
echo ""
echo "  Để dừng: chạy ./stop.sh"
