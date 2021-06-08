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

router.put('/edit-task', isAuth, taskController.editBacklog);

router.get('/getSubtasks', isAuth, subTaskController.getSubtasks);

router.post('/add-subtask', isAuth,[
    body('description').isString().withMessage('Please enter a valid Description.'),
],subTaskController.addSubtask);

router.put('/edit-subtask', isAuth, subTaskController.editSubtask);

router.put('/remove-subtask', isAuth, subTaskController.removeSubtask);

router.post('/complete-subtask', isAuth, subTaskController.completeSubtask);

router.put('/remove-task', isAuth, taskController.removeTask);

module.exports = router;