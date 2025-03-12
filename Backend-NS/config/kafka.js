import { Kafka, Partitioners } from 'kafkajs';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

console.log('Kafka Broker:', process.env.KAFKA_BROKER); // Debug log to check broker

const kafka = new Kafka({
  clientId: 'notification-service',
  // brokers: process.env.KAFKA_BROKER ? process.env.KAFKA_BROKER.split(',') : ['brave_bardeen:9092'],
  // brokers:["192.168.29.199:9092"],
  brokers:[process.env.KAFKA_BROKER],
  createPartitioner: Partitioners.LegacyPartitioner, // Fix partitioner warning
  retry: {
    retries: 7, // Increase retry count
    initialRetryTime: 300, // Initial retry delay in milliseconds
    factor: 2, // Exponential backoff factor
  },
});

export const producer = kafka.producer();
export const consumer = kafka.consumer({ groupId: 'notification-group' });

await producer.connect();
await consumer.connect();

await consumer.subscribe({ topic: 'notification_events', fromBeginning: false });

export default kafka;

