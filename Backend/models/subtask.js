const database= require('../utils/db');
class SubTask {

constructor(description,creator,isCompleted,completionTime,projectId,versionId,sprintId,taskId,orgId) {
    this.description = description;
    this.creator = creator;
    this.isCompleted = isCompleted;
    this.completionTime = completionTime
    this.projectId = projectId;
    this.versionId = versionId;
    this.sprintId = sprintId;
    this.taskId = taskId;
    this.orgId = orgId;
}

save() {
    const db = database.getDb();
    this.createdAt = new Date();
    this.updatedAt = new Date();
    return db.collection('subtasks').insertOne(this);
}

static getSubtasks(orgId, email, projectId, versionId, sprintId, taskId) {
    const db = database.getDb();
    return db.collection('subtasks').find({orgId: orgId, creator: email, projectId: projectId, 
        versionId: versionId, sprintId: sprintId, taskId: taskId}).toArray();
}

}

module.exports = SubTask;