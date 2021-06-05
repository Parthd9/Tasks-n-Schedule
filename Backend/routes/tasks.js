const express = require('express');
const router = express.Router();
const { body } = require('express-validator');

const isAuth = require('../middleware/is-auth')
const taskController = require('../controllers/tasks');
const subTaskController = require('../controllers/subtasks');
const taskValidator = require('../validators/task-validator');

router.get('/getBacklogs', isAuth,taskController.getBacklogs);

router.get('/getDevelopers', isAuth,taskController.getDevelopers);

router.post('/add-backlog', isAuth, taskValidator.backlogValidation(),taskController.addBacklog);

router.get('/getSubtasks', isAuth, subTaskController.getSubtasks);

router.post('/add-subtask', isAuth,[
    body('description').isString().withMessage('Please enter a valid Description.'),
],subTaskController.addSubtask);

module.exports = router;