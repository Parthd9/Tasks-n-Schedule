const database= require('../utils/db');

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

    save() {
        const db = database.getDb();
        this.createdAt = new Date();
        this.updatedAt = new Date();
        return db.collection('sprints').insertOne(this);
    }

    static getSprints(orgId, email, projectId, versionId) {
        const db = database.getDb();
        return db.collection('sprints').find({orgId: orgId, creator: email, projectId: projectId, versionId: versionId}).project({ creator: 1, description: 1, name:1 }).toArray();
    }

    static getSprintByName(sname, orgId, projectId, versionId) {
        const db = database.getDb();
        return db.collection('sprints').find({name: sname, orgId: orgId, projectId: projectId, versionId: versionId}).toArray();
    }
}

module.exports = Sprint;