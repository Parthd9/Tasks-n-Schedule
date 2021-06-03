const { body } = require('express-validator');
const Project = require('../models/project');

exports.projectValidation = () => {
    console.log('add project validation');
    return [
        body('desc').trim().not().isEmpty().isLength({min: 10, max: 200}),
        body('title').trim().not().isEmpty()
          .custom((value, { req }) => {
            return Project.getProjectByName(value).then(project => {
              console.log('proj by name:',project);
              if (project.length > 0) {
                return Promise.reject('Project with same name is already exist.');
              }
            });
          })
    ]
}