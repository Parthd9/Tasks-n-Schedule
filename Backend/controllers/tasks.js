const { validationResult } = require('express-validator');
const SubTask = require('../models/subtask');
const Task = require('../models/task');
const ObjectId = require('mongodb').ObjectId;

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
    let backlogDoc;
    const task = new Task(req.body.description,req.body.list,req.body.type,req.body.estTime,req.user.email,'Backlog',undefined,pId,vId,sId,req.user.orgId);
    task.save(false, undefined).then(backlogData => {
        console.log('inserted data:',backlogData['ops'][0]);
        backlogDoc = {
            _id: backlogData['ops'][0]['_id'], 
            creator: backlogData['ops'][0]['creator'],
            type: backlogData['ops'][0]['backlogType'],
            description: backlogData['ops'][0]['description'],
            estTime: backlogData['ops'][0]['estimatedTime'],
            createdAt: backlogData['ops'][0]['createdAt'],
            status: backlogData['ops'][0]['status'],
            };
        return Task.getTasksByStatus(req.user.orgId, sId);
    })
    .then(result => {
        console.log(result);
        // id1 = result[0]['_id'] !== undefined ? result[0]['_id'] : ;
        // id2 = result[1]['_id'] !== undefined ? result[1]['_id'] : 0;
        // id3 = result[2]['_id'];

        // count1 = result[0]['count'];
        // count2 = result[1]['count'];
        // count3 = result[2]['count'];

        // let statusArr = [{[id1]: count1, [id2]: count2, [id3]: count3, statusTime: new Date()}];
        // return Task.saveTaskStatus(req.user.orgId, sId, statusArr, 'Add');
        const data = {
            description: backlogDoc['description'],
            backlogType: backlogDoc['type'],
            estimatedTime: backlogDoc['estTime'],
            status: backlogDoc['status']
        }
        return SubTask.saveSpentTime(req.user.orgId, backlogDoc._id, sId, 0, data, 'Add');
    })
    .then(result => {
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
                const devList = developers[0]['team'];
                console.log('devlist:',devList);
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
            const data = {
                description: req.body.description,
                backlogType: req.body.type,
                estimatedTime: req.body.estTime,
                status: req.body.status
            }
            return SubTask.saveSpentTime(new ObjectId(req.user.orgId),  new ObjectId(req.body.id), sId, 0, data, 'Update');
         })
        .then(result => {
            res.status(202).json({message: 'Task updated successfully'});
        })
        .catch(error => {
            if(!error.statusCode) {
                error.statusCode = 500;
            }
            next(error);
        });
}

exports.removeTask = (req,res,next) => {
    const sId= req.query.sprintId;
    console.log('body:',req.body);
    if(!sId) {
        const error = new Error('Invalid sprint id');
        error.statusCode = 403;
        throw error;
    }

    Task.removeTask(req.user.orgId, req.body.id)
        .then(result => {
            console.log('res:',result);
            return Task.getTasksByStatus(req.user.orgId, sId);
        })
        .then(result => {
            // id1 = result[0]['_id'];
            // id2 = result[1]['_id'];
            // id3 = result[2]['_id'];
    
            // count1 = result[0]['count'];
            // count2 = result[1]['count'];
            // count3 = result[2]['count'];
    
            // let statusArr = {[id1]: count1, [id2]: count2, [id3]: count3, statusTime: new Date()};
            // return Task.saveTaskStatus(req.user.orgId, sId, statusArr, 'Update');
        })
        .then(result => {
            return SubTask.deleteSpentTime(new ObjectId(req.user.orgId), new ObjectId(req.body.id));
        })
        .then(result => {
            res.status(200).json({message: 'Task deleted successfully'});
        })
        .catch(err => {
            if(!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })
}