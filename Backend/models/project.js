const database= require('../utils/db');

class Project {
    constructor(name, description, team, orgId, creator) {
        this.name = name,
        this.description = description,
        this.team = team,
        this.orgId = orgId,
        this.creator = creator
    }

    save() {
        const db = database.getDb();
        this.createdAt = new Date();
        this.updatedAt = new Date();
        return db.collection('projects').insertOne(this);
    }

    static getProjectByName(pname) {
        const db = database.getDb();
        return db.collection('projects').find({name: pname}).toArray();
    }

    static getProjects(orgId, email) {
        const db = database.getDb();
        return db.collection('projects').find({orgId: orgId, creator: email}).project({ creator: 1, description: 1, name:1, team:1 }).toArray();
    }

    static getDevelopers(orgId) {
        const db = database.getDb();
        return db.collection('users').find({orgId: orgId, $or: [{role: 'Developer'},{role: 'Assurance'}]})
        .project({ firstName: 1, lastName: 1, email:1, role:1 , _id: 0}).toArray();
    }
}

module.exports = Project