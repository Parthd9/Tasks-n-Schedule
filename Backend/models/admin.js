const database= require('../utils/db');

class Admin {

    static getProjectsData(orgId) {
        const db = database.getDb();
        return db.collection('projects').find({orgId: orgId}).sort( { createdAt: -1 } )
        .project({createdAt:1,name:1, team: 1, technologies: 1}).toArray();
    }
    static getAllusersCount(orgId) {
        const db = database.getDb();
        return db.collection('users').aggregate(
            {$match: {orgId: orgId, role: {$nin: ['Admin'] } } }, 
            {$group: {_id: '$role',count: {$sum : 1} }},
            {$project: {count: 1}}
        ).toArray();
    }
    static techDataCount(orgId) {
        const db = database.getDb();
        return db.collection('projects').aggregate(
            {$match: {orgId: orgId } }, 
            {$unwind: '$technologies'},
            {$group: {_id: '$technologies',count: {$sum : 1} }},
            {$project: {count: 1}}
        ).toArray();
    }
    static getYearwiseProjectCount(orgId) {
        const db = database.getDb();
        let year = new Date().getFullYear();
        return db.collection('projects').aggregate(
            {$match: {orgId: orgId, creationYear: {$lte: year}} }, 
            {$group: {_id: "$creationYear" ,count: {$sum : 1} }},
            {$sort: { _id: 1 }},
            {$project: {count: 1}}
        ).toArray();
    }
    static getYearwiseUserCount(orgId) {
        const db = database.getDb();
        let year = new Date().getFullYear();
        return db.collection('users').aggregate(
            {$match: {orgId: orgId, creationYear: {$lte: year}} }, 
            {$group: {_id: "$creationYear" ,count: {$sum : 1} }},
            {$sort: { _id: 1 }},
            {$project: {count: 1}}
        ).toArray();
    }
}

module.exports = Admin