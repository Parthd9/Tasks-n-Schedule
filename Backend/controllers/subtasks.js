const { validationResult } = require("express-validator");
const SubTask = require("../models/subtask");
const Task = require("../models/task");
const ObjectId = require("mongodb").ObjectId;

exports.getSubtasks = async (req, res, next) => {
  try {
    const pId = req.query.projectId;
    const vId = req.query.versionId;
    const sId = req.query.sprintId;
    const tId = req.query.taskId;

    if (!pId && !vId && !sId && !tId) {
      const error = new Error(
        "Invalid project id/ version id/ sprint id/ task id"
      );
      error.statusCode = 403;
      throw error;
    }

    let subtasksDetail = [];
    let subtasks = await SubTask.getSubtasks(
      req.user.orgId,
      req.user.email,
      pId,
      vId,
      sId,
      tId
    );
    if (!subtasks) {
      subtasksDetail = [];
    } else {
      subtasksDetail = subtasks;
    }
    let taskDetails = await Task.getBacklogDetails(req.user.orgId, tId);
    if (taskDetails) {
      res
        .status(200)
        .json({ subtasks: subtasksDetail, taskDetails: taskDetails });
    } else {
      res.status(200).json({ subtasks: subtasksDetail, taskDetails: [] });
    }
  } catch (error) {
    console.log("error inside getSubtasks method:", error);
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.addSubtask = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    console.log(errors);

    const pId = req.query.projectId;
    const vId = req.query.versionId;
    const sId = req.query.sprintId;
    const tId = req.query.taskId;

    if (!pId && !vId && !sId && !tId) {
      const error = new Error(
        "Invalid project id/ version id/ sprint id/task id"
      );
      error.statusCode = 403;
      throw error;
    }

    if (!errors.isEmpty()) {
      const error = new Error("Please enter valid data.");
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }

    let subtaskDoc;
    const subtask = new SubTask(
      req.body.description,
      req.user.email,
      false,
      undefined,
      pId,
      vId,
      sId,
      tId,
      req.user.orgId
    );
    let subtaskData = await subtask.save();
    subtaskDoc = {
      _id: subtaskData["ops"][0]["_id"],
      creator: subtaskData["ops"][0]["creator"],
      isCompleted: subtaskData["ops"][0]["isCompleted"],
      description: subtaskData["ops"][0]["description"],
      createdAt: subtaskData["ops"][0]["createdAt"],
    };
    await Task.updateBacklogStatus(req.user.orgId, tId, "In-Progress");

    await SubTask.updateStatusInTaskDetail(
      new ObjectId(req.user.orgId),
      new ObjectId(tId),
      sId,
      "In-Progress"
    );
    subtaskDoc = { ...subtaskDoc, taskStatus: "In-Progress" };
    res.status(201).json({
      message: "Subtask added successfully.",
      status: "success",
      subtask: subtaskDoc,
    });
  } catch (err) {
    console.log("err inside addSubtask:", err);
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.editSubtask = async (req, res, next) => {
  try {
    await SubTask.editSubTask(req.user.orgId, req.body.id, req.body.desc);
    res.status(202).json({ message: "Subtask modified successfully." });
  } catch (error) {
    console.log("error inside editSubtask:", error);
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.removeSubtask = async (req, res, next) => {
  try {
    const tId = req.query.taskId;
    const sId = req.query.sprintId;

    if (!tId && !sId) {
      const error = new Error("Invalid task id/ sprintId");
      error.statusCode = 403;
      throw error;
    }
    let countDoc;
    let status = "In-Progress";
    let completedCount;
    await SubTask.removeSubtask(req.user.orgId, req.body.id);

    let count = await SubTask.getDocumentCount(req.user.orgId, tId);
    if (count === 0) {
      status = "Backlog";
      await Task.updateBacklogStatus(req.user.orgId, tId, "Backlog");
    } else {
      countDoc = count;
      completedCount = await SubTask.getCompletedDocumentCount(
        req.user.orgId,
        tId
      );
    }
    if (countDoc === completedCount) {
      status = "Completed";
      await Task.updateBacklogStatus(req.user.orgId, tId, "Completed");
    } else {
      status = status === "" ? "In-Progress" : status;
    }
    await SubTask.updateStatusInTaskDetail(
      new ObjectId(req.user.orgId),
      new ObjectId(tId),
      sId,
      status
    );
    res
      .status(200)
      .json({ message: "Subtask deleted successfully", status: status });
  } catch (err) {
    console.log("error inside remove sub-task:", err);
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.completeSubtask = async (req, res, next) => {
  try {
    const tId = req.query.taskId;
    const sId = req.query.sprintId;
    let subtaskCompletedCount;
    let type = "";
    let status = "";
    let data;
    if (!tId && !sId) {
      const error = new Error("Invalid task id/ sprint id");
      error.statusCode = 403;
      throw error;
    }
    await SubTask.subtaskComplete(
      req.user.orgId,
      req.body.id,
      req.body.completionTime
    );

    subtaskCompletedCount = await SubTask.getCompletedDocumentCount(
      req.user.orgId,
      tId
    );

    if (subtaskCompletedCount === 1) {
      type = "Add";
      delete req.body.taskDetails.developers;
      await SubTask.saveSpentTime(
        new ObjectId(req.user.orgId),
        new ObjectId(tId),
        sId,
        req.body.completionTime,
        req.body.taskDetails,
        "Update"
      );
    } else {
      type = "Update";
      data = await SubTask.getSpentTime(
        new ObjectId(req.user.orgId),
        new ObjectId(tId)
      );
    }
    if (type === "Update") {
      const updatedTime = +data["spentTime"] + req.body.completionTime;
      delete req.body.taskDetails.developers;
      await SubTask.saveSpentTime(
        new ObjectId(req.user.orgId),
        new ObjectId(tId),
        sId,
        updatedTime,
        req.body.taskDetails,
        "Update"
      );
    }
    let count = await SubTask.getDocumentCount(req.user.orgId, tId);
    if (count === subtaskCompletedCount) {
      status = "Completed";
      await Task.updateBacklogStatus(req.user.orgId, tId, "Completed");
    } else {
      type = "In-Progress";
      status = "In-Progress";
      res
        .status(200)
        .json({ message: "Subtask completed", status: "In-Progress" });
    }
    await SubTask.updateStatusInTaskDetail(
      new ObjectId(req.user.orgId),
      new ObjectId(tId),
      sId,
      status
    );
    if (type !== "In-Progress") {
      res
        .status(200)
        .json({ message: "Subtask completed", status: "Completed" });
    }
  } catch (err) {
    console.log("error inside complete sub-task:", err);
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
