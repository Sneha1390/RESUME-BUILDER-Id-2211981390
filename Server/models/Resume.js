const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema({
  name: String,
  email: String,
  education: String,
  experience: String,
  skills: String,
});

module.exports = mongoose.model('Resume', resumeSchema);
