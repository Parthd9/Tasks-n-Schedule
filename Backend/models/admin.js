const database= require('../utils/db');

class Admin {

    static getProjectsData(orgId) {
        const db = database.getDb();
        return db.collection('projects').find({orgId: orgId}).sort( { createdAt: -1 } )
        .project({createdAt:1,name:1, team: 1, technologies: 1}).toArray();
    }
}

module.exports = Admin