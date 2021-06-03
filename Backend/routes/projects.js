const express = require('express');
const router = express.Router();
const projectsController = require('../controllers/projects');
const versionsController = require('../controllers/versions');
const sprintsController = require('../controllers/sprints');
const isAuth = require('../middleware/is-auth');
const projectValidator = require('../validators/project-validator');

router.get('/getDevelopers', isAuth,projectsController.getDevelopers);

router.post('/add-project', isAuth, projectValidator.projectValidation(),projectsController.addProject);

router.get('/getProjects', isAuth, projectsController.getProjects);

router.get('/getVersions', isAuth,versionsController.getVersions);

router.post('/add-version', isAuth, projectValidator.versionValidation(),versionsController.addVersion);

router.get('/getSprints', isAuth,sprintsController.getSprints);

router.post('/add-sprint', isAuth, projectValidator.versionValidation(),sprintsController.addSprint);

module.exports = router;