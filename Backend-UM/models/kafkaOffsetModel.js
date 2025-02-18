const mongoose = require('mongoose');

const kafkaOffsetSchema = new mongoose.Schema({
  topic: { type: String, required: true },
  partition: { type: Number, required: true },
  offset: { type: String, required: true },
});

module.exports = mongoose.model('KafkaOffset', kafkaOffsetSchema);
