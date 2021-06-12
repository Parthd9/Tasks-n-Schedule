const { validationResult } = require("express-validator");
const SubTask = require("../models/subtask");
const Task = require("../models/task");
const ObjectId = require("mongodb").ObjectId;

exports.getBacklogs = async (req, res, next) => {
  try {
    const pId = req.query.projectId;
    const vId = req.query.versionId;
    const sId = req.query.sprintId;

    if (!pId && !vId && !sId) {
      const error = new Error("Invalid project id/ version id/ sprint id");
      error.statusCode = 403;
      throw error;
    }

    let backlogs = await Task.getBacklogs(
      req.user.orgId,
      req.user.email,
      pId,
      vId,
      sId
    );
    if (backlogs) {
      res.status(200).json({ backlogs: backlogs });
    } else {
      res.status(200).json({ backlogs: [] });
    }
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.addBacklog = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    console.log(errors);

    const pId = req.query.projectId;
    const vId = req.query.versionId;
    const sId = req.query.sprintId;

    if (!pId && !vId && !sId) {
      const error = new Error("Invalid project id/ version id/ sprint id");
      error.statusCode = 403;
      throw error;
    }

    if (!errors.isEmpty()) {
      const error = new Error("Please enter valid data.");
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }
    const task = new Task(
      req.body.description,
      req.body.developers,
      req.body.backlogType,
      req.body.estimatedTime,
      req.user.email,
      "Backlog",
      undefined,
      pId,
      vId,
      sId,
      req.user.orgId
    );
    let backlogData = await task.save(false, undefined);
    let backlogDoc = {
      _id: backlogData["ops"][0]["_id"],
      creator: backlogData["ops"][0]["creator"],
      backlogType: backlogData["ops"][0]["backlogType"],
      description: backlogData["ops"][0]["description"],
      estimatedTime: backlogData["ops"][0]["estimatedTime"],
      createdAt: backlogData["ops"][0]["createdAt"],
      status: backlogData["ops"][0]["status"],
      developers: backlogData["ops"][0]["developers"],
    };
    let tasksByStatus = await Task.getTasksByStatus(req.user.orgId, sId);
    // id1 = result[0]['_id'] !== undefined ? result[0]['_id'] : ;
    // id2 = result[1]['_id'] !== undefined ? result[1]['_id'] : 0;
    // id3 = result[2]['_id'];

    // count1 = result[0]['count'];
    // count2 = result[1]['count'];
    // count3 = result[2]['count'];

    // let statusArr = [{[id1]: count1, [id2]: count2, [id3]: count3, statusTime: new Date()}];
    // return Task.saveTaskStatus(req.user.orgId, sId, statusArr, 'Add');
    const data = {
      description: backlogDoc["description"],
      backlogType: backlogDoc["type"],
      estimatedTime: backlogDoc["estTime"],
      status: backlogDoc["status"],
    };
    await SubTask.saveSpentTime(
      req.user.orgId,
      backlogDoc._id,
      sId,
      0,
      data,
      "Add"
    );
    res.status(201).json({
      message: "Backlog added successfully.",
      status: "success",
      backlog: backlogDoc,
    });
  } catch (error) {
    console.log("err inside addBacklog:", error);
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.getDevelopers = async (req, res, next) => {
  try {
    const pId = req.query.projectId;
    if (!pId) {
      const error = new Error("Invalid project id");
      error.statusCode = 403;
      throw error;
    }
    let developers = await Task.getDevelopers(req.user.orgId, pId);
    if (developers) {
      const devList = developers[0]["team"];
      res.status(200).json({ developers: devList });
    } else {
      res.status(200).json({ developers: [] });
    }
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.editBacklog = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    console.log(errors);

    const pId = req.query.projectId;
    const vId = req.query.versionId;
    const sId = req.query.sprintId;

    if (!pId && !vId && !sId) {
      const error = new Error("Invalid project id/ version id/ sprint id");
      error.statusCode = 403;
      throw error;
    }

    if (!errors.isEmpty()) {
      const error = new Error("Please enter valid data.");
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }

    const task = new Task(
      req.body.description,
      req.body.developers,
      req.body.backlogType,
      req.body.estimatedTime,
      req.user.email,
      req.body.status,
      undefined,
      pId,
      vId,
      sId,
      req.user.orgId
    );
    await task.save(true, req.body.id);
    const data = {
      description: req.body.description,
      backlogType: req.body.type,
      estimatedTime: req.body.estTime,
      status: req.body.status,
    };
    await SubTask.saveSpentTime(
      new ObjectId(req.user.orgId),
      new ObjectId(req.body.id),
      sId,
      0,
      data,
      "Update"
    );
    res.status(202).json({ message: "Task updated successfully" });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.removeTask = async (req, res, next) => {
  try {
    const sId = req.query.sprintId;
    if (!sId) {
      const error = new Error("Invalid sprint id");
      error.statusCode = 403;
      throw error;
    }
    await Task.removeTask(req.user.orgId, req.body.id);
    await Task.getTasksByStatus(req.user.orgId, sId);
    await SubTask.deleteSpentTime(
      new ObjectId(req.user.orgId),
      new ObjectId(req.body.id)
    );
    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};
