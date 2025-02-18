const kafka = require('./kafka');
const { USER_EVENTS, SYSTEM_EVENTS } = require('./topics');  // Import updated topics

const producer = kafka.producer();

// Produce message to the appropriate Kafka topic
const produceMessage = async (eventType, message) => {
  try {
    await producer.connect();

    let topic;
    
    // Check the eventType and assign the correct Kafka topic
    switch (eventType) {
      case 'LOGIN':
        topic = USER_EVENTS.LOGIN;
        break;
      case 'REGISTERED':
        topic = USER_EVENTS.REGISTERED;
        break;
      case 'PASSWORD_RESET':
        topic = USER_EVENTS.PASSWORD_RESET;
        break;
      case 'USER_ACCOUNT':
        topic = SYSTEM_EVENTS.USER_ACCOUNT;
        break;
      case 'ORDER':
        topic = SYSTEM_EVENTS.ORDER;
        break;
      case 'PROMOTION':
        topic = SYSTEM_EVENTS.PROMOTION;
        break;
      default:
        throw new Error('Unknown event type');
    }

    // Send the message to the corresponding topic
    await producer.send({
      topic,
      messages: [{ value: JSON.stringify(message) }],
    });

    console.log(`Message sent to topic '${topic}':`, message);
  } catch (error) {
    console.error('Error producing message:', error);
  }
};

module.exports = { produceMessage };
