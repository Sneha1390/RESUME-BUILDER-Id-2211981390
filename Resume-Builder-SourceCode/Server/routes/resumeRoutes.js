const express = require('express');
const { createResume } = require('../controllers/resumeController');

const router = express.Router();
router.post('/', createResume);

module.exports = router;
