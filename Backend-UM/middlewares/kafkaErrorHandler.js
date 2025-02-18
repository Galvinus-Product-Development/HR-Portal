class KafkaErrorHandler {
  // Handles errors when processing a message from Kafka
  static handleMessageError(topic, error) {
    console.error(`Error processing message from topic '${topic}':`, error.message);

    // Additional custom logging or error handling for specific topics or events
    if (topic === 'USER_ACCOUNT_NOTIFICATIONS') {
      console.error('This error occurred while processing a user account notification.');
    } else if (topic === 'ORDER_NOTIFICATIONS') {
      console.error('This error occurred while processing an order notification.');
    } else if (topic === 'PROMOTION_NOTIFICATIONS') {
      console.error('This error occurred while processing a promotion notification.');
    }

    // Optionally, you can add more context or trigger retries here
  }

  // Handles errors when there is a Kafka connection error
  static handleConnectionError(error) {
    console.error('Kafka connection error:', error.message);

    // Here, you can include custom logic for retrying connections or alerting admins
  }

  // Handles errors when subscribing to Kafka topics
  static handleSubscriptionError(topic, error) {
    console.error(`Error subscribing to topic '${topic}':`, error.message);
    
    // Custom handling for subscription errors
    if (topic === 'USER_ACCOUNT_NOTIFICATIONS') {
      console.error('Error occurred when subscribing to user account notifications.');
    }
  }

  // Handles general Kafka errors and logs the stack trace
  static handleGeneralKafkaError(error) {
    console.error('Kafka error:', error.message);
    console.error(error.stack);  // Print full stack trace for debugging
  }
}

module.exports = KafkaErrorHandler;
