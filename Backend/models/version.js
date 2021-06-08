const database= require('../utils/db');
const ObjectId = require('mongodb').ObjectId;

class Version {

    constructor(name, description, orgId, creator, projectId) {
        this.name = name,
        this.description = description,
        this.projectId = projectId,
        this.orgId = orgId,
        this.creator = creator
    }

    save(id) {
        const db = database.getDb();
        if(!id) {
            this.createdAt = new Date();
            this.updatedAt = new Date();
            return db.collection('versions').insertOne(this);
        } else {
            this.updatedAt = new Date();
            return db.collection('versions').updateOne({_id: new ObjectId(id)},{$set: this});
        }
    }

    static getVersions(orgId, email, projectId) {
        const db = database.getDb();
        return db.collection('versions').find({orgId: orgId, projectId: projectId}).project({ creator: 1, description: 1, name:1 }).toArray();
    }

    static getVersionByName(vname, orgId, projectId) {
        const db = database.getDb();
        return db.collection('versions').find({name: vname, orgId: orgId, projectId: projectId}).toArray();
    }
}

module.exports = Version;