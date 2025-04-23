const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const employees = [
    {
        id: '656a1234567890abcdef1234',
        name: 'Alice Johnson',
        jobTitle: 'Software Engineer',
        department: 'Engineering',
        location: 'New York',
        phone: '1234567890',
    },
    {
        id: '656b234567890abcdef12345',
        name: 'Bob Smith',
        jobTitle: 'HR Manager',
        department: 'HR',
        location: 'San Francisco',
        phone: '9876543210',
    }
];

const attendanceRecords = [
    {
        id: '757a1234567890abcdef1234',
        employeeId: '656a1234567890abcdef1234',
        date: new Date('2025-02-18'),
        punchInTime: new Date('2025-02-18T09:00:00'),
        punchOutTime: new Date('2025-02-18T17:00:00'),
        attendanceStatus: 'Present',
        punchInMethod: 'Smart Phone Face Detection',
        punchOutMethod: 'Biometric',
    },
    {
        id: '757b234567890abcdef12345',
        employeeId: '656b234567890abcdef12345',
        date: new Date('2025-02-18'),
        punchInTime: new Date('2025-02-18T09:15:00'),
        punchOutTime: new Date('2025-02-18T18:00:00'),
        attendanceStatus: 'Present',
        punchInMethod: 'Smart Phone Face Detection',
        punchOutMethod: 'Biometric',
    }
];

const seedDatabase = async () => {
    try {
        console.log('Seeding database...');

        await prisma.employee.createMany({
            data: employees
        });

        await prisma.attendance.createMany({
            data: attendanceRecords
        });

        console.log('Seeding completed successfully.');
    } catch (error) {
        console.error('Error seeding database:', error);
    } finally {
        await prisma.$disconnect();
    }
};

seedDatabase();
// (async()=>await prisma.overtime.deleteMany({}))();

