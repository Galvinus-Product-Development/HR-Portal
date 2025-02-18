const { USER_ACCOUNT, ORDER, PROMOTION } = require('./eventSchemas');
const KafkaErrorHandler = require('./kafkaErrorHandler');

/**
 * Validates if the message contains all required fields based on the schema.
 * @param {Object} schema - The schema that defines required fields.
 * @param {Object} message - The message that is being validated.
 * @throws {Error} - If any required fields are missing.
 */
const validateMessage = (schema, message) => {
  const missingFields = schema.requiredFields.filter(field => !message.hasOwnProperty(field));
  
  if (missingFields.length) {
    const errorMsg = `Missing required fields: ${missingFields.join(', ')}`;
    console.error(errorMsg);
    KafkaErrorHandler.handleValidationError(errorMsg);
    throw new Error(errorMsg);
  }
};

/**
 * A function to log the validation result for message.
 * @param {Object} schema - The schema that defines required fields.
 * @param {Object} message - The message that is being validated.
 * @returns {string} - Success message if validation passes.
 */
const logValidationSuccess = (schema, message) => {
  console.log(`Message validated successfully for schema '${schema.type}'`, message);
  return `Validation passed for schema: ${schema.type}`;
};

/**
 * Validate the user account notification message based on the USER_ACCOUNT schema.
 * @param {Object} message - The user account notification message.
 * @throws {Error} - If validation fails.
 */
const validateUserAccountMessage = (message) => {
  validateMessage(USER_ACCOUNT, message);
  logValidationSuccess(USER_ACCOUNT, message);
};

/**
 * Validate the order notification message based on the ORDER schema.
 * @param {Object} message - The order notification message.
 * @throws {Error} - If validation fails.
 */
const validateOrderMessage = (message) => {
  validateMessage(ORDER, message);
  logValidationSuccess(ORDER, message);
};

/**
 * Validate the promotion notification message based on the PROMOTION schema.
 * @param {Object} message - The promotion notification message.
 * @throws {Error} - If validation fails.
 */
const validatePromotionMessage = (message) => {
  validateMessage(PROMOTION, message);
  logValidationSuccess(PROMOTION, message);
};

/**
 * General validation for any message type.
 * @param {string} type - The type of message (user_account, order, promotion).
 * @param {Object} message - The message to validate.
 * @throws {Error} - If validation fails for the given type.
 */
const validateGeneralMessage = (type, message) => {
  let schema;
  switch (type) {
    case 'USER_ACCOUNT':
      schema = USER_ACCOUNT;
      break;
    case 'ORDER':
      schema = ORDER;
      break;
    case 'PROMOTION':
      schema = PROMOTION;
      break;
    default:
      throw new Error('Invalid message type');
  }

  validateMessage(schema, message);
  logValidationSuccess(schema, message);
};

module.exports = {
  validateMessage,
  validateUserAccountMessage,
  validateOrderMessage,
  validatePromotionMessage,
  validateGeneralMessage
};
