const database= require('../utils/db');
const ObjectId = require('mongodb').ObjectId;

class Project {
    constructor(name, description, team, technologies ,orgId, creator) {
        this.name = name,
        this.description = description,
        this.team = team,
        this.technologies = technologies,
        this.orgId = orgId,
        this.creator = creator
    }

    save(id) {
        const db = database.getDb();
        if(!id) {
            this.createdAt = new Date();
            this.updatedAt = new Date();
            return db.collection('projects').insertOne(this);
        } else {
            this.updatedAt = new Date();
            return db.collection('projects').updateOne({_id: new ObjectId(id)},{$set: this});
        }
        
    }

    static getProjectByName(pname) {
        const db = database.getDb();
        return db.collection('projects').find({name: pname}).toArray();
    }

    static getProjects(orgId, email) {
        const db = database.getDb();
        return db.collection('projects').find({orgId: orgId, creator: email}).project({ creator: 1, description: 1, name:1, team:1, technologies:1 }).toArray();
    }

    static getDevelopers(orgId) {
        const db = database.getDb();
        return db.collection('users').find({orgId: orgId, $or: [{role: 'Developer'},{role: 'Assurance'}]})
        .project({ firstName: 1, lastName: 1, email:1, role:1 , _id: 0}).toArray();
    }

}

module.exports = Project