const Resume = require('../models/Resume');

const createResume = async (req, res) => {
  try {
    const resume = new Resume(req.body);
    await resume.save();
    res.status(201).json(resume);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = { createResume };
