const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  getTags,
  createTag,
  updateTag,
  deleteTag
} = require('../controllers/tagController');

// All tag routes are protected → require authentication
router.get('/', auth, getTags);       // fetch user's tags
router.post('/', auth, createTag);    // create new tag
router.put('/:id', auth, updateTag);  // update existing tag
router.delete('/:id', auth, deleteTag); // delete tag

module.exports = router;