const { Kafka, Partitioners } = require('kafkajs');
const dotenv = require('dotenv');

dotenv.config();

console.log('Kafka Broker:', process.env.KAFKA_BROKER);

const kafka = new Kafka({
  clientId: 'notification-service',
  brokers: process.env.KAFKA_BROKER.split(','), // Fixing broker parsing
  createPartitioner: Partitioners.LegacyPartitioner,
  retry: {
    retries: 7,
    initialRetryTime: 300,
    factor: 2,
  },
});

const producer = kafka.producer();
const consumer = kafka.consumer({ groupId: 'notification-group' });

async function initKafka() {
  try {
    await producer.connect();
    console.log('✅ Kafka Producer connected');

    await consumer.connect();
    console.log('✅ Kafka Consumer connected');

    // ❌ REMOVE this line, subscription happens in app.js
    // await consumer.subscribe({ topic: 'notification_events', fromBeginning: false });

  } catch (error) {
    console.error('❌ Kafka connection error:', error);
  }
}

initKafka().catch(console.error);

module.exports = { kafka, producer, consumer };
