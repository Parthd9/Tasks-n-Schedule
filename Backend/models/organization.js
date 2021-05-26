const database= require('../utils/db');

class Organization {
    constructor(orgName, orgDomain) {
        this.orgName = orgName;
        this.orgDomain = orgDomain;
    }

    save() {
        const db= database.getDb();
        var d = new Date();
        var year = d.getFullYear();
        var month = d.getMonth();
        var day = d.getDate();
        var c = new Date(year + 1, month, day);

        this.validity= c;
        this.isActive = true;
        this.createdAt = new Date(); 
        return db.collection('organization')
            .insertOne(this)
            .then(orgData => {
                console.log('Org Id:',orgData.insertedId);
                return orgData.insertedId;
            })
            .catch(err => console.log(err));
        
    }
}

module.exports = Organization;