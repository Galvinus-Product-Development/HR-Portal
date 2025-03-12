const { PrismaClient, Status, Department } = require('@prisma/client');
const { ObjectId } = require('mongodb');

const prisma = new PrismaClient();

const employees = [
    {
        id: new ObjectId().toString(),
        name: 'Alice Johnson',
        jobTitle: 'Software Engineer',
        department: Department.Engineering,
        location: 'New York',
        phone: '1234567890'
    },
    {
        id: new ObjectId().toString(),
        name: 'Bob Smith',
        jobTitle: 'HR Manager',
        department: Department.HR,
        location: 'San Francisco',
        phone: '9876543210'
    }
];

const attendanceRecords = [
    {
        id: new ObjectId().toString(),
        employeeId: employees[0].id,
        date: new Date('2025-02-18'),
        punchInTime: new Date('2025-02-18T09:00:00'),
        punchOutTime: new Date('2025-02-18T17:00:00'),
        attendanceStatus: Status.Present,
        punchInMethod: 'Smart Phone Face Detection',
        punchOutMethod: 'Biometric',
        presentDays: 1,
        lateDays: 0,
        overtime: 2,
        lateComing: 0,
        workingHours: 8
    },
    {
        id: new ObjectId().toString(),
        employeeId: employees[1].id,
        date: new Date('2025-02-18'),
        punchInTime: new Date('2025-02-18T09:15:00'),
        punchOutTime: new Date('2025-02-18T18:00:00'),
        attendanceStatus: Status.Present,
        punchInMethod: 'Smart Phone Face Detection',
        punchOutMethod: 'Biometric',
        presentDays: 1,
        lateDays: 0,
        overtime: 3,
        lateComing: 1,
        workingHours: 9
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
        console.error('Error seeding database:', error.meta || error.message || error);
    } finally {
        await prisma.$disconnect();
    }
};

seedDatabase();
