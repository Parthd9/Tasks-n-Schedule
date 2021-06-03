const Sprint = require('../models/sprint');
const { validationResult } = require('express-validator');


exports.getSprints = (req, res, next) => {
    const pId= req.query.projectId;
    const vId= req.query.versionId;
    // console.log('pId:',pId);
    if(!pId && !vId) {
        const error = new Error('Invalid project id/ version id');
        error.statusCode = 403;
        throw error;
    }
    Sprint.getSprints(req.user.orgId, req.user.email, pId, vId)
            .then(sprints => {
                if(sprints) {
                    res.status(200).json({sprints:sprints});
                } else {
                    res.status(200).json({sprints:[]})
                }
            })
            .catch(error => {
                if(!error.statusCode) {
                    error.statusCode = 500;
                }
                next(error);
            });
}

exports.addSprint = (req, res, next) => {
    const errors = validationResult(req);
    console.log(errors);

    const pId= req.query.projectId;
    const vId= req.query.versionId;
    // console.log('pId:',pId);
    if(!pId && !vId) {
        const error = new Error('Invalid project id/ version id');
        error.statusCode = 403;
        throw error;
    }


    if (!errors.isEmpty()) {
      const error = new Error('Validation failed. Sprint name must be unique.');
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }

    const sprint = new Sprint(req.body.title,req.body.desc,req.user.orgId,req.user.email, pId, vId);
    sprint.save().then(sprintData => {
        console.log('inserted data:',sprintData['ops'][0]);
        let sprintDoc = {
            _id: sprintData['ops'][0]['_id'], 
            creator: sprintData['ops'][0]['creator'],
            name: sprintData['ops'][0]['name'],
            description: sprintData['ops'][0]['description']
            };
        res.status(201).json({message: 'Sprint added successfully.',status: 'success', data: sprintDoc});
    })
    .catch(err => {
        console.log('err inside addSprint:',err);
        if(!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    })
}