const kafka = require('./kafka');
const KafkaErrorHandler = require('./kafkaErrorHandler');
const NotificationService = require('../services/notificationService');
const { USER_EVENTS, SYSTEM_EVENTS } = require('./topics'); // Import updated topics

const consumer = kafka.consumer({ groupId: 'notification-service' });

/**
 * Function to dynamically subscribe to topics based on provided list of topics.
 * @param {Array} topics - List of topics to subscribe to.
 */
const subscribeToTopics = async (topics) => {
  try {
    for (const topic of topics) {
      await consumer.subscribe({ topic, fromBeginning: true });
      console.log(`Subscribed to topic: ${topic}`);
    }
  } catch (error) {
    console.error('Error subscribing to topics:', error);
  }
};

/**
 * Consume messages from Kafka topics based on dynamic subscription.
 * @param {Array} topicsToConsume - List of topics to consume from.
 */
const consumeMessages = async (topicsToConsume = []) => {
  try {
    await consumer.connect();

    // If no specific topics are provided, subscribe to all the default events
    if (topicsToConsume.length === 0) {
      topicsToConsume = [
        USER_EVENTS.LOGIN,
        USER_EVENTS.REGISTERED,
        USER_EVENTS.PASSWORD_RESET,
        SYSTEM_EVENTS.USER_ACCOUNT,
        SYSTEM_EVENTS.ORDER,
        SYSTEM_EVENTS.PROMOTION,
      ];
    }

    // Dynamically subscribe to the provided topics
    await subscribeToTopics(topicsToConsume);

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        try {
          const parsedMessage = JSON.parse(message.value.toString());
          console.log(`Message received from topic '${topic}':`, parsedMessage);

          // Process the notification based on the topic type
          await NotificationService.processNotification(parsedMessage, topic);
        } catch (error) {
          KafkaErrorHandler.handleMessageError(topic, error);
        }
      },
    });
  } catch (error) {
    console.error('Error starting Kafka consumer:', error);
  }
};

module.exports = { consumeMessages };
