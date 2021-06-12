const Version = require("../models/version");
const { validationResult } = require("express-validator");

exports.getVersions = async (req, res, next) => {
  try {
    const pId = req.query.projectId;
    if (!pId) {
      const error = new Error("Invalid project id");
      error.statusCode = 403;
      throw error;
    }
    let versions = await Version.getVersions(
      req.user.orgId,
      req.user.email,
      pId
    );
    if (versions) {
      res.status(200).json({ versions: versions });
    } else {
      res.status(200).json({ versions: [] });
    }
  } catch (error) {
    console.log("error inside getVersion:", error);
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.addVersion = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    console.log(errors);

    const pId = req.query.projectId;

    if (!pId) {
      const error = new Error("Invalid project id");
      error.statusCode = 403;
      throw error;
    }

    if (!errors.isEmpty()) {
      const error = new Error(
        "Validation failed. Version name must be unique."
      );
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }

    const version = new Version(
      req.body.title,
      req.body.desc,
      req.user.orgId,
      req.user.email,
      pId
    );
    let versionData = await version.save();
    let versionDoc = {
      _id: versionData["ops"][0]["_id"],
      creator: versionData["ops"][0]["creator"],
      name: versionData["ops"][0]["name"],
      description: versionData["ops"][0]["description"],
    };
    res.status(201).json({
      message: "Version added successfully.",
      status: "success",
      data: versionDoc,
    });
  } catch (err) {
    console.log("err inside addVersion:", err);
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.editVersion = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    console.log(errors);

    const pId = req.query.projectId;
    // console.log('date',req.body.selectedDate);
    if (!pId) {
      const error = new Error("Invalid project id");
      error.statusCode = 403;
      throw error;
    }

    if (!errors.isEmpty()) {
      const error = new Error(
        "Validation failed. version name must be unique."
      );
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }

    const version = new Version(
      req.body.title,
      req.body.desc,
      req.user.orgId,
      req.user.email,
      pId
    );
    await version.save(req.body.id);
    res.status(202).json({ message: "Version updated successfully." });
  } catch (err) {
    console.log("err inside editversion:", err);
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
