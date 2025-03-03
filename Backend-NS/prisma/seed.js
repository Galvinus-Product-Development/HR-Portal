import { PrismaClient } from '@prisma/client';
import { ObjectId } from 'mongodb';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding notifications...');

  await prisma.notification.deleteMany(); // Clear existing notifications before seeding

  const notifications = [
    {
      userId: new ObjectId().toString(),
      sourceId: new ObjectId().toString(),
      sourceType: 'USER',
      type: 'AUTO',
      title: 'Upcoming Training Session',
      message: 'You have a mandatory training session scheduled for next week.',
      status: 'UNREAD',
      priority: 'HIGH',
    },
    {
      userId: new ObjectId().toString(),
      sourceId: new ObjectId().toString(),
      sourceType: 'SYSTEM',
      type: 'MANUAL',
      title: 'Company Update',
      message: 'The company town hall meeting is scheduled for Friday.',
      status: 'READ',
      priority: 'NORMAL',
      readAt: new Date(),
    },
    {
      userId: new ObjectId().toString(),
      sourceId: new ObjectId().toString(),
      sourceType: 'SERVICE',
      type: 'AUTO',
      title: 'Leave Request Approved',
      message: 'Your leave request has been approved.',
      status: 'UNREAD',
      priority: 'LOW',
    },
  ];

  await prisma.notification.createMany({
    data: notifications,
  });

  console.log('Seeding complete!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
