import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('admin123', 10);
  const employeePassword = await bcrypt.hash('employee123', 10);

  // Create departments
  const boardDept = await prisma.department.upsert({
    where: { name: 'Ban Giám đốc' },
    update: {},
    create: { name: 'Ban Giám đốc' },
  });

  const hrDept = await prisma.department.upsert({
    where: { name: 'Phòng Nhân sự' },
    update: {},
    create: { name: 'Phòng Nhân sự', parentId: boardDept.id },
  });

  const techDept = await prisma.department.upsert({
    where: { name: 'Phòng Công nghệ' },
    update: {},
    create: { name: 'Phòng Công nghệ', parentId: boardDept.id },
  });

  const financeDept = await prisma.department.upsert({
    where: { name: 'Phòng Tài chính' },
    update: {},
    create: { name: 'Phòng Tài chính', parentId: boardDept.id },
  });

  // Create HR Admin user
  await prisma.user.upsert({
    where: { email: 'admin@company.com' },
    update: {},
    create: {
      email: 'admin@company.com',
      password: hashedPassword,
      fullName: 'Nguyễn Văn Admin',
      role: 'HR_ADMIN',
      position: 'HR Manager',
      departmentId: hrDept.id,
      phone: '0901234567',
    },
  });

  // Create sample employees
  await prisma.user.upsert({
    where: { email: 'nv1@company.com' },
    update: {},
    create: {
      email: 'nv1@company.com',
      password: employeePassword,
      fullName: 'Trần Thị Bình',
      role: 'EMPLOYEE',
      position: 'Software Engineer',
      departmentId: techDept.id,
      phone: '0912345678',
    },
  });

  await prisma.user.upsert({
    where: { email: 'nv2@company.com' },
    update: {},
    create: {
      email: 'nv2@company.com',
      password: employeePassword,
      fullName: 'Lê Hoàng Cường',
      role: 'EMPLOYEE',
      position: 'Accountant',
      departmentId: financeDept.id,
      phone: '0923456789',
    },
  });

  // Create sample policies
  await prisma.policy.upsert({
    where: { id: 1 },
    update: {},
    create: {
      title: 'Quy định nghỉ phép năm',
      category: 'Nhân sự',
      content: 'Nhân viên chính thức được nghỉ phép 12 ngày/năm. Phép năm không sử dụng hết sẽ được chuyển sang năm sau (tối đa 5 ngày).',
    },
  });

  await prisma.policy.upsert({
    where: { id: 2 },
    update: {},
    create: {
      title: 'Chính sách bảo mật thông tin',
      category: 'IT',
      content: 'Tất cả nhân viên phải tuân thủ chính sách bảo mật thông tin công ty. Không chia sẻ mật khẩu, không cài phần mềm không được phép.',
    },
  });

  await prisma.policy.upsert({
    where: { id: 3 },
    update: {},
    create: {
      title: 'Quy trình thanh toán công tác phí',
      category: 'Tài chính',
      content: 'Nhân viên cần nộp đầy đủ chứng từ trong vòng 5 ngày làm việc sau khi kết thúc công tác. Hoá đơn phải có đầy đủ thông tin công ty.',
    },
  });

  // Create sample announcement
  await prisma.announcement.upsert({
    where: { id: 1 },
    update: {},
    create: {
      title: 'Thông báo lịch nghỉ Tết Nguyên Đán 2026',
      content: 'Công ty thông báo lịch nghỉ Tết Nguyên Đán từ 28/01 đến 05/02/2026. Nhân viên sắp xếp công việc trước kỳ nghỉ.',
      authorId: 1,
    },
  });

  console.log('Seed data created successfully');
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
