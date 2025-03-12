const { PrismaClient, LeaveType, LeaveDuration, LeaveStatus } = require('@prisma/client');

const prisma = new PrismaClient();

const employees = [
    {
        id: '11111111-1111-1111-1111-111111111111',
        name: 'Alice Johnson',
        employeeId: 'EMP001',
        jobTitle: 'Software Engineer',
        department: 'Engineering',
        location: 'New York',
        phone: '1234567890'
    },
    {
        id: '22222222-2222-2222-2222-222222222222',
        name: 'Bob Smith',
        employeeId: 'EMP002',
        jobTitle: 'HR Manager',
        department: 'HR',
        location: 'San Francisco',
        phone: '9876543210'
    },
    {
        id: '33333333-3333-3333-3333-333333333333',
        name: 'Charlie Davis',
        employeeId: 'EMP003',
        jobTitle: 'Marketing Executive',
        department: 'Marketing',
        location: 'Chicago',
        phone: '5556667777'
    }
];

const leaveRequests = [
    {
        id: 'aaaaaaa1-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
        employeeId: employees[0].id,
        leaveType: LeaveType.SICK,
        startDate: new Date('2025-03-10'),
        endDate: new Date('2025-03-12'),
        reason: 'Flu and fever',
        leaveDuration: LeaveDuration.FULL_DAY,
        status: LeaveStatus.PENDING
    },
    {
        id: 'aaaaaaa2-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
        employeeId: employees[1].id,
        leaveType: LeaveType.CASUAL,
        startDate: new Date('2025-03-15'),
        endDate: new Date('2025-03-16'),
        reason: 'Family function',
        leaveDuration: LeaveDuration.FULL_DAY,
        status: LeaveStatus.APPROVED,
        decisionAt: new Date('2025-03-05'),
        adminRemarks: 'Approved as per policy'
    },
    {
        id: 'aaaaaaa3-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
        employeeId: employees[2].id,
        leaveType: LeaveType.COMPENSATORY,
        startDate: new Date('2025-03-20'),
        endDate: new Date('2025-03-20'),
        reason: 'Worked extra on weekend',
        leaveDuration: LeaveDuration.HALF_DAY,
        status: LeaveStatus.ON_HOLD
    }
];

const leaveHistories = [
    {
        id: 'bbbbbbb1-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
        employeeId: employees[0].id,
        leaveType: LeaveType.SICK,
        duration: 3,
        appliedOn: new Date('2025-03-01'),
        status: LeaveStatus.APPROVED,
        paidLeave: 3,
        unpaidLeave: 0
    },
    {
        id: 'bbbbbbb2-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
        employeeId: employees[1].id,
        leaveType: LeaveType.CASUAL,
        duration: 2,
        appliedOn: new Date('2025-02-25'),
        status: LeaveStatus.APPROVED,
        paidLeave: 2,
        unpaidLeave: 0
    },
    {
        id: 'bbbbbbb3-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
        employeeId: employees[2].id,
        leaveType: LeaveType.COMPENSATORY,
        duration: 1,
        appliedOn: new Date('2025-02-28'),
        status: LeaveStatus.REJECTED,
        paidLeave: 0,
        unpaidLeave: 1,
        adminRemarks: 'Compensatory leave denied due to policy restrictions'
    }
];

const leavePolicies = [
    {
        id: 'ccccccc1-cccc-cccc-cccc-cccccccccccc',
        policyName: 'Casual Leave Policy',
        policyCategory: 'Casual',
        documentUrl: 'https://example.com/casual-leave-policy.pdf'
    },
    {
        id: 'ccccccc2-cccc-cccc-cccc-cccccccccccc',
        policyName: 'Sick Leave Policy',
        policyCategory: 'Sick',
        documentUrl: 'https://example.com/sick-leave-policy.pdf'
    },
    {
        id: 'ccccccc3-cccc-cccc-cccc-cccccccccccc',
        policyName: 'Compensatory Leave Policy',
        policyCategory: 'Compensatory',
        documentUrl: 'https://example.com/compensatory-leave-policy.pdf'
    }
];

const seedDatabase = async () => {
    try {
        console.log('Seeding database...');

        await prisma.employee.createMany({
            data: employees
        });

        await prisma.leaveRequest.createMany({
            data: leaveRequests
        });

        await prisma.leaveHistory.createMany({
            data: leaveHistories
        });

        await prisma.leavePolicy.createMany({
            data: leavePolicies
        });

        console.log('Seeding completed successfully.');
    } catch (error) {
        console.error('Error seeding database:', error.meta || error.message || error);
    } finally {
        await prisma.$disconnect();
    }
};

seedDatabase();
