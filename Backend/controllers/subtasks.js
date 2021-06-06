const { validationResult } = require('express-validator');
const SubTask = require('../models/subtask');
const Task = require('../models/task');

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

    let subtasksDetail = [];
    SubTask.getSubtasks(req.user.orgId, req.user.email, pId, vId, sId, tId)
        .then(subtasks => {
                console.log('subtask:',subtasks);
                if(!subtasks)
                {
                    subtasksDetail = [];
                } else {
                    subtasksDetail=subtasks
                }
                return Task.getBacklogDetails(req.user.orgId, tId);
            })
        .then(taskDetails => {
            console.log('taskdetails:',taskDetails);
            if(taskDetails) {
                res.status(200).json({subtasks: subtasksDetail, taskDetails: taskDetails});
            } else {
                res.status(200).json({subtasks: subtasksDetail, taskDetails: []});
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

    let subtaskDoc;
    const subtask = new SubTask(
    req.body.description, req.user.email,false,undefined,pId,vId,sId,tId,req.user.orgId);
    subtask.save().then(subtaskData => {
        console.log('inserted data:',subtaskData['ops'][0]);
        subtaskDoc = {
            _id: subtaskData['ops'][0]['_id'], 
            creator: subtaskData['ops'][0]['creator'],
            isCompleted: subtaskData['ops'][0]['isCompleted'],
            description: subtaskData['ops'][0]['description'],
            createdAt: subtaskData['ops'][0]['createdAt']
            };
        return Task.updateBacklogStatus(req.user.orgId, tId, 'In-Progress');
    })
    .then(result => {
        subtaskDoc = {...subtaskDoc,taskStatus : 'In-Progress'};
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

exports.editSubtask = (req, res, next) => {
    console.log('req:',req.body)
    SubTask.editSubTask(req.user.orgId, req.body.id, req.body.desc)
            .then(result => {
                console.log(result);
                res.status(202).json({message: 'Subtask modified successfully.'});
            })
            .catch(error => {
                if(!error.statusCode) {
                    error.statusCode = 500;
                }
                next(error);
            })

}

exports.removeSubtask = (req, res, next) => {
    const tId= req.query.taskId;

    if(!tId) {
        const error = new Error('Invalid task id');
        error.statusCode = 403;
        throw error;
    }
    let countDoc;
    let status='In-Progress';
    SubTask.removeSubtask(req.user.orgId, req.body.id)
            .then(result => {
                return SubTask.getDocumentCount(req.user.orgId, tId);
            })
            .then(count => {
                if(count===0) {
                    status = 'Backlog';
                    console.log('status:',status);
                    return Task.updateBacklogStatus(req.user.orgId, tId, 'Backlog');
                } else {
                    countDoc = count;
                    return SubTask.getCompletedDocumentCount(req.user.orgId, tId)
                }
            })
            .then(completedCount => {
                if(countDoc===completedCount) {
                    status='Completed';
                    console.log('status:',status);
                    return Task.updateBacklogStatus(req.user.orgId, tId, 'Completed');
                } else {
                    status = status === '' ? 'In-Progress' : status;
                } 
            })
            .then(result => {
                res.status(200).json({message: 'Subtask deleted successfully', status: status});
                
            })
            .catch(err => {
                if(!err.statusCode) {
                    err.statusCode = 500;
                }
                next(err);
            })
}

exports.completeSubtask = (req, res, next) => {
    const tId= req.query.taskId;
    let subtaskCompletedCount;
    if(!tId) {
        const error = new Error('Invalid task id');
        error.statusCode = 403;
        throw error;
    }
    SubTask.subtaskComplete(req.user.orgId, req.body.id, req.body.completionTime)
            .then(result => {
                return SubTask.getCompletedDocumentCount(req.user.orgId, tId)
            })
            .then(completedCount => {
                subtaskCompletedCount = completedCount;
                return SubTask.getDocumentCount(req.user.orgId, tId);
            })
            .then(count => {
                if(count === subtaskCompletedCount) {
                    return Task.updateBacklogStatus(req.user.orgId, tId, 'Completed')
                } else {
                    res.status(200).json({message: 'Subtask completed', status: 'In-Progress'})
                }
            })
            .then(result => {
                res.status(200).json({message: 'Subtask completed', status: 'Completed'})
            })
            .catch(err => {
                if(!err.statusCode) {
                    err.statusCode = 500;
                }
                next(err);
            })
}