const database= require('../utils/db');
const ObjectId = require('mongodb').ObjectId;
class SubTask {

constructor(description,creator,isCompleted,completionTime,projectId,versionId,sprintId,taskId,orgId) {
    this.description = description;
    this.creator = creator;
    this.isCompleted = isCompleted;
    this.completionTime = completionTime;
    this.projectId = projectId;
    this.versionId = versionId;
    this.sprintId = sprintId;
    this.taskId = taskId;
    this.orgId = orgId;
}

save() {
    const db = database.getDb();
    this.createdAt = new Date();
    this.updatedAt = new Date();
    return db.collection('subtasks').insertOne(this);
}

static getSubtasks(orgId, email, projectId, versionId, sprintId, taskId) {
    const db = database.getDb();
    return db.collection('subtasks').find({orgId: orgId, projectId: projectId, 
        versionId: versionId, sprintId: sprintId, taskId: taskId}).toArray();
}

static editSubTask(orgId, subtaskId, description) {
    const db = database.getDb();
    return db.collection('subtasks').updateOne({_id: new ObjectId(subtaskId), orgId: orgId},{$set: {description: description}});
}

static removeSubtask(orgId, subtaskId) {
    const db = database.getDb();
    return db.collection('subtasks').deleteOne({orgId: orgId, _id: new ObjectId(subtaskId)});
}

static getDocumentCount(orgId, taskId) {
    const db = database.getDb();
    return db.collection('subtasks').find({orgId: orgId, taskId: taskId}).count();
}
static subtaskComplete(orgId, subtaskId, completionTime) {
    const db = database.getDb();
    return db.collection('subtasks').updateOne({orgId: orgId, _id: new ObjectId(subtaskId)}, {$set: {completionTime: completionTime, isCompleted: true}});
}
static getCompletedDocumentCount(orgId, taskId) {
    const db = database.getDb();
    return db.collection('subtasks').find({orgId: orgId, taskId: taskId, isCompleted: true}).count();
}
static saveSpentTime(orgId, taskId, sId,time, taskDetails,type) {
    const db = database.getDb();
    if(type==='Add') {
        return db.collection('backlog-subtask').insertOne({orgId: orgId, taskId: taskId, sprintId: sId,spentTime: time, taskDetails: taskDetails});
    } else {
        console.log('time:',time);
        console.log('sprintid:',sId);
        return db.collection('backlog-subtask').updateOne({orgId: orgId, taskId: taskId, sprintId: sId},{$set: {spentTime: time, taskDetails: taskDetails}});
    }
}
static updateStatusInTaskDetail(orgId, taskId,sprintId, status) {
    const db = database.getDb();
    return db.collection('backlog-subtask').updateOne({orgId: orgId, taskId: taskId, sprintId: sprintId},{$set: {'taskDetails.status': status}});
}

static getSpentTime(orgId, taskId) {
    const db = database.getDb();
    return db.collection('backlog-subtask').findOne({orgId: orgId, taskId: taskId});
}
static deleteSpentTime(orgId, taskId) {
    const db = database.getDb();
    return db.collection('backlog-subtask').deleteOne({orgId: orgId, taskId: taskId});
}

static getSpentTimeBySprint(orgId, sprintId) {
    const db = database.getDb();
    return db.collection('backlog-subtask').find({orgId: orgId, sprintId: sprintId}).toArray();
}

}
module.exports = SubTask;