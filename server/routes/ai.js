const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { smartSuggest } = require('../controllers/aiController');

// Protected route → only authenticated users can access AI suggestions
router.post('/suggest', auth, smartSuggest);

module.exports = router;