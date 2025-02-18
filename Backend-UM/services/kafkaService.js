const { produceMessage } = require('./producer');
const { consumeMessages } = require('./consumer');
const KafkaErrorHandler = require('./kafkaErrorHandler'); // Error handler for better error logging

class KafkaService {
  // Send a message to a Kafka topic
  static async sendMessage(topic, message) {
    try {
      await produceMessage(topic, message);
      console.log(`Message successfully sent to topic: ${topic}`);
    } catch (error) {
      console.error(`Failed to send message to topic '${topic}':`, error.message);
      KafkaErrorHandler.handleGeneralKafkaError(error);
    }
  }

  // Start the Kafka consumer and begin consuming messages
  static async startConsumer() {
    try {
      await consumeMessages();
      console.log('Kafka consumer started successfully.');
    } catch (error) {
      console.error('Error starting Kafka consumer:', error.message);
      KafkaErrorHandler.handleConnectionError(error); // Handle Kafka connection error
    }
  }

  // Utility to restart consumer after failures or issues
  static async restartConsumer() {
    try {
      console.log('Attempting to restart Kafka consumer...');
      await consumeMessages();
      console.log('Kafka consumer restarted successfully.');
    } catch (error) {
      console.error('Error restarting Kafka consumer:', error.message);
      KafkaErrorHandler.handleConnectionError(error); // Handle connection error during restart
    }
  }

  // Helper method to handle retries for sending messages to Kafka
  static async retrySendMessage(topic, message, retries = 3) {
    try {
      await produceMessage(topic, message);
      console.log(`Message successfully sent to topic: ${topic}`);
    } catch (error) {
      if (retries > 0) {
        console.log(`Retrying message to topic '${topic}'...`);
        await this.retrySendMessage(topic, message, retries - 1);
      } else {
        console.error(`Failed to send message to topic '${topic}' after retries:`, error.message);
        KafkaErrorHandler.handleGeneralKafkaError(error); // Handle final failure
      }
    }
  }
}

module.exports = KafkaService;
