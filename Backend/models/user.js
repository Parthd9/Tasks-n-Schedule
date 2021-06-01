const database= require('../utils/db');


class User {
    constructor(firstName, lastName, email, password, orgId, role) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.password = password;
        this.orgId = orgId;
        this.role = role;
    }

    save() {
        const db= database.getDb();
        this.dummy_password = '';
        this.isActive = true;
        this.createdAt = new Date();
        this.updatedAt = new Date();

        return db.collection('users')
            .insertOne(this)
            .then(userData => {
                // console.log(userData);
                return userData.insertedId;
            })
            .catch(err => console.log(err));
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
}

module.exports = User;