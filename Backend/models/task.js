const database= require('../utils/db');
const ObjectId = require('mongodb').ObjectId;

class Task {
    constructor(description,developers,backlogType,estimatedTime,creator,status,completionTime,projectId,
        versionId,sprintId,orgId) {
            this.description = description,
            this.developers = developers;
            this.backlogType = backlogType;
            this.estimatedTime = estimatedTime;
            this.creator = creator;
            this.status = status;
            this.completionTime = completionTime
            this.projectId = projectId;
            this.versionId = versionId;
            this.sprintId = sprintId;
            this.orgId = orgId;
    }

    save(isEdit, taskId) {
        const db = database.getDb(); 
        
        if(isEdit) {
            this.updatedAt = new Date();
            return db.collection('tasks').updateOne({_id: new ObjectId(taskId)},{$set: this});
        } else {
            this.createdAt = new Date();
            this.updatedAt = new Date();
            return db.collection('tasks').insertOne(this);   
        }
    }

    static getBacklogs(orgId, email, projectId, versionId, sprintId) {
        const db = database.getDb();
        return db.collection('tasks').find({orgId: orgId, creator: email, projectId: projectId, 
            versionId: versionId, sprintId: sprintId})
        .project({ creator: 1, description: 1, createdAt: 1, backlogType:1, estimatedTime: 1, status: 1}).toArray();
    }

    static getDevelopers(orgId, projectId) {
        const db = database.getDb();
        // return db.collection('projects').find({orgId: orgId, _id: new ObjectId(projectId),team: {$elemMatch: {role : "Developer"}}}).toArray();
        return db.collection('projects').aggregate(
            {$match: {orgId: orgId, _id: new ObjectId(projectId)} }, 
            {$unwind: '$team'},
            {$match : {"team.role": 'Developer'}},
            {$group: {_id: '$name',team: {$push : '$team'} }},
            {$project: {team: 1}}
        ).toArray();
    }
    static getBacklogDetails(orgId, taskId) {
        const db = database.getDb();
        return db.collection('tasks').find({orgId: orgId, _id: new ObjectId(taskId)})
                .project({developers: 1,status:1, description:1,_id:0}).toArray();
    }
    static updateBacklogStatus(orgId, taskId, status) {
        const db = database.getDb();
        return db.collection('tasks').updateOne({orgId: orgId, _id: new ObjectId(taskId)}, {$set: {status: status}});
    }

    static removeTask(orgId, taskId) {
        const db = database.getDb();
        return db.collection('tasks').deleteOne({orgId: orgId, _id: new ObjectId(taskId)});
    }
}

module.exports = Task;