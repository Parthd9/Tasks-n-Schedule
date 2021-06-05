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

    save() {
        const db = database.getDb();
        this.createdAt = new Date();
        this.updatedAt = new Date();
        return db.collection('tasks').insertOne(this);
    }

    static getBacklogs(orgId, email, projectId, versionId, sprintId) {
        const db = database.getDb();
        return db.collection('tasks').find({orgId: orgId, creator: email, projectId: projectId, 
            versionId: versionId, sprintId: sprintId})
        .project({ creator: 1, description: 1, createdAt: 1, backlogType:1, estimatedTime: 1}).toArray();
    }

    static getDevelopers(orgId, projectId) {
        const db = database.getDb();
        return db.collection('projects').find({orgId: orgId, _id: new ObjectId(projectId), 'team.role': 'Developer'})
        .project({team: 1, _id:0}).toArray();
    }
}

module.exports = Task;