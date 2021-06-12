const { body } = require("express-validator");
const Project = require("../models/project");
const Version = require("../models/version");
const Sprint = require("../models/sprint");

exports.projectValidation = () => {
  console.log("add project validation");
  return [
    body("description").trim().not().isEmpty().isLength({ min: 10, max: 200 }),
    body("name")
      .trim()
      .not()
      .isEmpty()
      .custom((value, { req }) => {
        return Project.getProjectByName(value).then((project) => {
          console.log("proj by name:", project);
          if (project.length > 0) {
            return Promise.reject("Project with same name is already exist.");
          }
        });
      }),
  ];
};

exports.versionValidation = () => {
  console.log("add version validation");
  return [
    body("desc").trim().not().isEmpty().isLength({ min: 10, max: 200 }),
    body("title")
      .trim()
      .not()
      .isEmpty()
      .custom((value, { req }) => {
        return Version.getVersionByName(
          value,
          req.user.orgId,
          req.query.projectId
        ).then((version) => {
          console.log("version by name:", version);
          if (version.length > 0) {
            return Promise.reject("Version with same name is already exist.");
          }
        });
      }),
  ];
};

exports.sprintValidation = () => {
  console.log("add sprint validation");
  return [
    body("desc").trim().not().isEmpty().isLength({ min: 10, max: 200 }),
    body("title")
      .trim()
      .not()
      .isEmpty()
      .custom((value, { req }) => {
        return Sprint.getSprintByName(
          value,
          req.user.orgId,
          req.query.projectId,
          req.query.versionId
        ).then((sprint) => {
          console.log("version by name:", sprint);
          if (sprint.length > 0) {
            return Promise.reject("Sprint with same name is already exist.");
          }
        });
      }),
  ];
};

exports.editProjectValidation = () => {
  console.log("edit project validation");
  return [
    body("description").trim().not().isEmpty().isLength({ min: 20, max: 200 }),
    body("name").trim().not().isEmpty(),
  ];
};

exports.editVersionValidation = () => {
  console.log("edit version validation");
  return [
    body("desc").trim().not().isEmpty().isLength({ min: 10, max: 200 }),
    body("title").trim().not().isEmpty(),
  ];
};

exports.editSprintValidation = () => {
  console.log("edit sprint validation");
  return [
    body("desc").trim().not().isEmpty().isLength({ min: 10, max: 200 }),
    body("title").trim().not().isEmpty(),
  ];
};
