const { Schema, model } = require('mongoose');

const profiles = new Schema({
  userId: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  guildId: {
    type: String,
    required: true,
  },
  registeredDate: {
    type: Date,
    default: Date.now,
  },
});

module.exports = model('profiles', profiles);
