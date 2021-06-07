const database= require('../utils/db');
const ObjectId = require('mongodb').ObjectId;

class Sprint {

    constructor(name, description, orgId, creator,completionDate,projectId, versionId) {
        this.name = name,
        this.description = description,
        this.projectId = projectId,
        this.versionId = versionId,
        this.orgId = orgId,
        this.creator = creator,
        this.completionDate = completionDate;
    }

    save(id) {
        const db = database.getDb();
        if(!id) {
            this.updatedAt = new Date();
            this.createdAt = new Date();
            return db.collection('sprints').insertOne(this);
        } else {
            this.updatedAt = new Date();
            return db.collection('sprints').updateOne({_id: new ObjectId(id)},{$set: this});
        }
        
    }

    static getSprints(orgId, email, projectId, versionId) {
        const db = database.getDb();
        return db.collection('sprints').find({orgId: orgId, creator: email, projectId: projectId, versionId: versionId}).project({ creator: 1, description: 1, name:1, completionDate:1 }).toArray();
    }

    static getSprintByName(sname, orgId, projectId, versionId) {
        const db = database.getDb();
        return db.collection('sprints').find({name: sname, orgId: orgId, projectId: projectId, versionId: versionId}).toArray();
    }
}

module.exports = Sprint;