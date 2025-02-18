const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'notification-server',
  brokers: ['localhost:9092'],
  logLevel: 1, // Set logging level (1 = ERROR, 2 = WARN, 3 = INFO, 4 = DEBUG)
});

module.exports = kafka;
