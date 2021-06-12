const Project = require("../models/project");
const { validationResult } = require("express-validator");
const nodemailer = require("nodemailer");

exports.getDevelopers = async (req, res, next) => {
  try {
    let developers = await Project.getDevelopers(req.user.orgId);
    if (developers) {
      res.status(200).json({ developers: developers });
    } else {
      res.status(200).json({ developers: [] });
    }
  } catch (err) {
    console.log("err in getDevelopers:", err);
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.addProject = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    console.log(errors);
    if (!errors.isEmpty()) {
      const error = new Error(
        "Validation failed. Project name must be unique."
      );
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }

    const project = new Project(
      req.body.name,
      req.body.description,
      req.body.team,
      req.body.technologies,
      req.user.orgId,
      req.user.email
    );
    let projectData = await project.save(undefined);
    let projectDoc = {
      _id: projectData["ops"][0]["_id"],
      creator: projectData["ops"][0]["creator"],
      name: projectData["ops"][0]["name"],
      description: projectData["ops"][0]["description"],
      team: projectData["ops"][0]["team"],
      technologies: projectData["ops"][0]["technologies"],
    };

    for (li of req.body.team) {
      var transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "tasknschedule@gmail.com",
          pass: "",
        },
      });

      let from = `<tasknschedule@gmail.com> On Behalf of <${req.user.email}>`;
      var mailOptions = {
        from: from,

        to: li["email"],
        subject: `${req.user.orgName} - ${req.body.title} - Initiation`,
        html:
          "<h4>Dear " +
          li["name"] +
          ",</h4>\n" +
          `<p>You are added as a member of project ${req.body.title} by ${req.user.email}</p>\n
                    <p>For more project details please go through the TnS project page.</p>\n
                    <p>Thanks!</p>\n<p>--</p>\n<p>Team TnS</p>`,
      };

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          // console.log('Email sent: ' + info.response);
        }
      });
    }
    res.status(201).json({
      message: "Project added successfully.",
      status: "success",
      data: projectDoc,
    });
  } catch (err) {
    console.log("err inside addProject:", err);
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getProjects = async (req, res, next) => {
  try {
    let projects = await Project.getProjects(
      req.user.orgId,
      req.user.email,
      req.user.role
    );
    if (projects) {
      res.status(200).json({ projects: projects });
    } else {
      res.status(200).json({ projects: [] });
    }
  } catch (err) {
    console.log("err inside getProjects:", err);
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.editProject = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    console.log(errors);
    if (!errors.isEmpty()) {
      const error = new Error(
        "Validation failed. Project name must be unique."
      );
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }

    const project = new Project(
      req.body.name,
      req.body.description,
      req.body.team,
      req.body.technologies,
      req.user.orgId,
      req.user.email
    );
    await project.save(req.body.id);
    res.status(202).json({ message: "Project updated successfully." });
  } catch (err) {
    console.log("err inside getProjects:", err);
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
