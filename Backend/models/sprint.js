const database= require('../utils/db');

class Sprint {

    constructor(name, description, orgId, creator, projectId, versionId) {
        this.name = name,
        this.description = description,
        this.projectId = projectId,
        this.versionId = versionId,
        this.orgId = orgId,
        this.creator = creator
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

    static getSprintByName(sname) {
        const db = database.getDb();
        return db.collection('sprints').find({name: sname}).toArray();
    }
}

module.exports = Sprint;