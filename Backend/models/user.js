const database= require('../utils/db');
const ObjectId = require('mongodb').ObjectId;

class User {
    constructor(firstName, lastName, email, password, orgId, role, orgName) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.password = password;
        this.orgId = orgId;
        this.role = role;
        this.orgName = orgName;
    }

    save() {
        const db= database.getDb();
        this.dummy_password = '';
        this.isActive = true;
        this.createdAt = new Date();
        this.updatedAt = new Date();

        return db.collection('users')
            .insertOne(this);
    }

    static findUser(userData) {
        const db= database.getDb();
        return db.collection('users')
            .findOne({email: userData.email})
            .then(user => {
                console.log(user);
                return user;
            })
            .catch(err => console.log(err));
    }

    static findUsersByOrgId(orgId) {
        const db= database.getDb();
        return db.collection('users')
                    .find({orgId: orgId})
                    .project({firstName: 1, lastName: 1, email: 1, role: 1, _id:1})
                    .toArray();
    }

    static updateUser(fname, lname, role, id) {
        const db= database.getDb();
        return db.collection('users').updateOne({_id: new ObjectId(id)},{ $set: {firstName: fname, lastName: lname, role: role, updatedAt: new Date()}});
    }

    static removeUser(orgId, userId) {
        const db= database.getDb();
        return db.collection('users').deleteOne({_id: new ObjectId(userId), orgId: orgId});
    }
}

module.exports = User;