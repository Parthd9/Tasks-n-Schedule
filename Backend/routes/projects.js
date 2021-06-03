const express = require('express');
const router = express.Router();
const projectsController = require('../controllers/projects');
const isAuth = require('../middleware/is-auth');
const projectValidator = require('../validators/project-validator');

router.get('/getDevelopers', isAuth,projectsController.getDevelopers);

router.post('/add-project', isAuth, projectValidator.projectValidation(),projectsController.addProject);

router.get('/getProjects', isAuth, projectsController.getProjects);

module.exports = router;