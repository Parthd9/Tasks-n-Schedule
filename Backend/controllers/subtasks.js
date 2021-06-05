const { validationResult } = require('express-validator');
const SubTask = require('../models/subtask');

exports.getSubtasks = (req,res,next) => {
    const pId= req.query.projectId;
    const vId= req.query.versionId;
    const sId= req.query.sprintId;
    const tId= req.query.taskId;
    
    if(!pId && !vId && !sId && !tId) {
        const error = new Error('Invalid project id/ version id/ sprint id/ task id');
        error.statusCode = 403;
        throw error;
    }

    SubTask.getSubtasks(req.user.orgId, req.user.email, pId, vId, sId, tId)
        .then(subtasks => {
            if(subtasks) {
                console.log('subtask:',subtasks);
                res.status(200).json({subtasks:subtasks});
            } else {
                res.status(200).json({subtasks:[]})
            }
            })
        .catch(error => {
            if(!error.statusCode) {
                error.statusCode = 500;
            }
            next(error);
        });
}

exports.addSubtask = (req, res, next) => {
    const errors = validationResult(req);
    console.log(errors);

    const pId= req.query.projectId;
    const vId= req.query.versionId;
    const sId= req.query.sprintId;
    const tId= req.query.taskId;

    if(!pId && !vId && !sId && !tId) {
        const error = new Error('Invalid project id/ version id/ sprint id/task id');
        error.statusCode = 403;
        throw error;
    }

    if (!errors.isEmpty()) {
      const error = new Error('Please enter valid data.');
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }

    const subtask = new SubTask(
    req.body.description, req.user.email,false,undefined,pId,vId,sId,tId,req.user.orgId);
    subtask.save().then(subtaskData => {
        console.log('inserted data:',subtaskData['ops'][0]);
        let subtaskDoc = {
            _id: subtaskData['ops'][0]['_id'], 
            creator: subtaskData['ops'][0]['creator'],
            isCompleted: subtaskData['ops'][0]['isCompleted'],
            description: subtaskData['ops'][0]['description'],
            createdAt: subtaskData['ops'][0]['createdAt']
            };
        res.status(201).json({message: 'Subtask added successfully.',status: 'success', subtask: subtaskDoc});
    })
    .catch(err => {
        console.log('err inside addSubtask:',err);
        if(!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    })
}
