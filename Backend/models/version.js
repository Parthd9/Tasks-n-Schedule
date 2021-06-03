const database= require('../utils/db');

class Version {

    constructor(name, description, orgId, creator, projectId) {
        this.name = name,
        this.description = description,
        this.projectId = projectId,
        this.orgId = orgId,
        this.creator = creator
    }

    save() {
        const db = database.getDb();
        this.createdAt = new Date();
        this.updatedAt = new Date();
        return db.collection('versions').insertOne(this);
    }

    static getVersions(orgId, email, projectId) {
        const db = database.getDb();
        return db.collection('versions').find({orgId: orgId, creator: email, projectId: projectId}).project({ creator: 1, description: 1, name:1 }).toArray();
    }

    static getVersionByName(vname) {
        const db = database.getDb();
        return db.collection('versions').find({name: vname}).toArray();
    }
}

module.exports = Version;