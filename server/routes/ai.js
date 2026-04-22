const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { smartSuggest } = require('../controllers/aiController');

router.post('/suggest', auth, smartSuggest);

module.exports = router;