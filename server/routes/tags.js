const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  getTags,
  createTag,
  updateTag,
  deleteTag
} = require('../controllers/tagController');

router.get('/', auth, getTags);
router.post('/', auth, createTag);
router.put('/:id', auth, updateTag);
router.delete('/:id', auth, deleteTag);

module.exports = router;