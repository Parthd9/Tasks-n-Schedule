const { validationResult } = require('express-validator');
const Task = require('../models/task');

exports.getBacklogs = (req,res,next) => {
    const pId= req.query.projectId;
    const vId= req.query.versionId;
    const sId= req.query.sprintId;
    
    if(!pId && !vId && !sId) {
        const error = new Error('Invalid project id/ version id/ sprint id');
        error.statusCode = 403;
        throw error;
    }

    Task.getBacklogs(req.user.orgId, req.user.email, pId, vId, sId)
        .then(backlogs => {
            if(backlogs) {
                res.status(200).json({backlogs:backlogs});
            } else {
                res.status(200).json({backlogs:[]})
            }
            })
        .catch(error => {
            if(!error.statusCode) {
                error.statusCode = 500;
            }
            next(error);
        });
}

exports.addBacklog = (req, res, next) => {
    const errors = validationResult(req);
    console.log(errors);

    const pId= req.query.projectId;
    const vId= req.query.versionId;
    const sId= req.query.sprintId;

    if(!pId && !vId && !sId) {
        const error = new Error('Invalid project id/ version id/ sprint id');
        error.statusCode = 403;
        throw error;
    }

    if (!errors.isEmpty()) {
      const error = new Error('Please enter valid data.');
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }

    const task = new Task(req.body.description,req.body.list,req.body.type,req.body.estTime,req.user.email,'Backlog',undefined,pId,vId,sId,req.user.orgId);
    task.save(false, undefined).then(backlogData => {
        console.log('inserted data:',backlogData['ops'][0]);
        let backlogDoc = {
            _id: backlogData['ops'][0]['_id'], 
            creator: backlogData['ops'][0]['creator'],
            type: backlogData['ops'][0]['backlogType'],
            description: backlogData['ops'][0]['description'],
            estTime: backlogData['ops'][0]['estimatedTime'],
            createdAt: backlogData['ops'][0]['createdAt']
            };
        res.status(201).json({message: 'Backlog added successfully.',status: 'success', backlog: backlogDoc});
    })
    .catch(err => {
        console.log('err inside addBacklog:',err);
        if(!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    })
}

exports.getDevelopers = (req,res,next) => {
    const pId= req.query.projectId;
    
    if(!pId) {
        const error = new Error('Invalid project id');
        error.statusCode = 403;
        throw error;
    }

    Task.getDevelopers(req.user.orgId,pId)
        .then(developers => {
            console.log('devs:',developers);
            if(developers) {
                const devList = developers[0]['team'].filter(dev => {
                    return dev['role'] === 'Developer';
                  });
                res.status(200).json({developers:devList});
            } else {
                res.status(200).json({developers:[]})
            }
            })
        .catch(error => {
            if(!error.statusCode) {
                error.statusCode = 500;
            }
            next(error);
        });
}

exports.editBacklog = (req, res, next) => {
    const errors = validationResult(req);
    console.log(errors);

    const pId= req.query.projectId;
    const vId= req.query.versionId;
    const sId= req.query.sprintId;

    if(!pId && !vId && !sId) {
        const error = new Error('Invalid project id/ version id/ sprint id');
        error.statusCode = 403;
        throw error;
    }

    if (!errors.isEmpty()) {
      const error = new Error('Please enter valid data.');
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }

    const task = new Task(req.body.description,req.body.list,req.body.type,req.body.estTime,req.user.email,req.body.status,undefined,pId,vId,sId,req.user.orgId);
    task.save(true, req.body.id)
        .then(backlogData => {
            res.status(202).json({message: 'Task updated successfully'})
         })
        .catch(error => {
            if(!error.statusCode) {
                error.statusCode = 500;
            }
            next(error);
        });

}