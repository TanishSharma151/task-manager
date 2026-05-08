const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  markDone,
  reopenTask
} = require('../controllers/taskController');

// All task routes are protected → require authentication
router.get('/', auth, getTasks);          // fetch tasks with filters/search
router.post('/', auth, createTask);       // create new task
router.put('/:id', auth, updateTask);     // update task details
router.delete('/:id', auth, deleteTask);  // delete task

// Task-specific actions
router.patch('/:id/done', auth, markDone);     // mark task as done
router.patch('/:id/reopen', auth, reopenTask); // reopen completed task

module.exports = router;