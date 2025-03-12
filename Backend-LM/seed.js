const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('Seeding database...');

    // Seed Employees
    const employees = await prisma.employee.createMany({
        data: [
            {
                id: 'e1',
                name: 'Alice Johnson',
                employeeId: 'EMP001',
                jobTitle: 'Software Engineer',
                department: 'IT',
                location: 'New York',
                phone: '1234567890',
            },
            {
                id: 'e2',
                name: 'Bob Smith',
                employeeId: 'EMP002',
                jobTitle: 'HR Manager',
                department: 'HR',
                location: 'San Francisco',
                phone: '0987654321',
            },
        ],
        skipDuplicates: true,
    });

    // Seed Leave Requests
    const leaveRequests = await prisma.leaveRequest.createMany({
        data: [
            {
                id: 'lr1',
                employeeId: 'e1',
                leaveType: 'CASUAL',
                startDate: new Date('2024-03-10'),
                endDate: new Date('2024-03-12'),
                reason: 'Personal Work',
                leaveDuration: 'FULL_DAY',
                status: 'PENDING',
            },
            {
                id: 'lr2',
                employeeId: 'e2',
                leaveType: 'SICK',
                startDate: new Date('2024-04-01'),
                endDate: new Date('2024-04-03'),
                reason: 'Fever & Cold',
                leaveDuration: 'FULL_DAY',
                status: 'APPROVED',
            },
        ],
        skipDuplicates: true,
    });

    // Seed Leave History
    const leaveHistory = await prisma.leaveHistory.createMany({
        data: [
            {
                id: 'lh1',
                employeeId: 'e1',
                employeeName: 'Alice Johnson',
                leaveType: 'CASUAL',
                duration: 2,
                appliedOn: new Date('2024-03-01'),
                status: 'APPROVED',
            },
            {
                id: 'lh2',
                employeeId: 'e2',
                employeeName: 'Bob Smith',
                leaveType: 'SICK',
                duration: 3,
                appliedOn: new Date('2024-03-28'),
                status: 'APPROVED',
            },
        ],
        skipDuplicates: true,
    });

    // Seed Leave Policies
    const leavePolicies = await prisma.leavePolicy.createMany({
        data: [
            {
                id: 'lp1',
                policyName: 'General Leave Policy',
                policyCategory: 'GENERAL',
                documentUrl: 'https://example.com/general-leave-policy.pdf',
            },
            {
                id: 'lp2',
                policyName: 'Maternity Leave Policy',
                policyCategory: 'MATERNITY',
                documentUrl: 'https://example.com/maternity-leave-policy.pdf',
            },
        ],
        skipDuplicates: true,
    });

    console.log('Seeding completed!');
}

main()
    .catch((e) => {
        console.error('Error while seeding:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
