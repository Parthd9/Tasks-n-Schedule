const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");

const User = require("../models/user");
const helper = require("../utils/helper");
const Admin = require("../models/admin");
const Project = require("../models/project");
const Task = require("../models/task");

const { validationResult } = require("express-validator");

exports.addUser = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    console.log(errors);
    if (!errors.isEmpty()) {
      const error = new Error(
        "Validation failed. Please enter user-data in valid format."
      );
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }

    let password = helper.getRandomString(6);
    let generatedhashedPwd = await bcrypt.hash(password, 10);
    if (!generatedhashedPwd) {
      const error = new Error("Something went wrong");
      error.statusCode = 500;
      throw error;
    }
    let usersCount = await User.getOrgUsersCount(req.user.orgId);

    if (usersCount[0]["count"] >= 100) {
      const error = new Error("Already 100 users in the organization");
      error.statusCode = 406;
      throw error;
    }
    const user = new User(
      req.body.fname,
      req.body.lname,
      req.body.email,
      generatedhashedPwd,
      req.user.orgId,
      req.body.role,
      req.user.orgName
    );
    let result = await user.save();

    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "tasknschedule@gmail.com",
        pass: process.env.email,
      },
    });

    let from = `<tasknschedule@gmail.com> On Behalf of <${req.user.email}>`;
    var mailOptions = {
      from: from,
      to: req.body.email,
      subject: "Welcome to Task-n-Schedule",
      html:
        "<h4>Dear " +
        req.body.fname +
        " " +
        req.body.lname +
        ",</h4>\n" +
        `<p>Your credentials has been created by admin ${req.user.email}</p>\n
                <p>Role: <strong>${req.body.role}</strong></p>
                <p>Login id: <strong>${req.body.email}</strong></p>\n
                <p>Generated password: <strong>${password}</strong></p>\n
                <p>Please use above credentials to login.</p>
                <p>Thanks!</p>\n<p>--</p>\n<p>Team TnS</p>`,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        // console.log('Email sent: ' + info.response);
      }
    });
    let userDoc = {
      _id: result["ops"][0]["_id"],
      firstName: result["ops"][0]["firstName"],
      lastName: result["ops"][0]["lastName"],
      email: result["ops"][0]["email"],
      role: result["ops"][0]["role"],
    };

    res.status(201).json({ user: userDoc });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getUsers = async (req, res, next) => {
  try {
    const usersDoc = await User.findUsersByOrgId(req.user.orgId);
    if (usersDoc) {
      res.status(200).json({ users: usersDoc });
    } else {
      res.status(200).json({ users: [] });
    }
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.editUser = async (req, res, next) => {
  try {
    const fname = req.body.fname;
    const userId = req.body.id;
    const lname = req.body.lname;
    const role = req.body.role;
    const email = req.body.email;

    const errors = validationResult(req);
    console.log(errors);

    if (!errors.isEmpty()) {
      const error = new Error(
        "Validation failed. Please enter user-data in valid format."
      );
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }
    await User.updateUser(fname, lname, role, userId);
    await Project.updateProjectTeam(req.user.orgId, {
      name: fname + " " + lname,
      email: email,
      role: role,
    });
    if (role === "Developer") {
      await Task.updateDeveloperTeam(req.user.orgId, {
        name: fname + " " + lname,
        email: email,
        role: role,
      });
    } else {
      await Task.removeUserFromDevelopers(req.user.orgId, email);
    }
    res.status(202).json({ message: "User updated successfully." });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.removeUser = async (req, res, next) => {
  try {
    await User.removeUser(req.user.orgId, req.body.id);
    await Project.removeUserFromProjectTeam(req.user.orgId, req.body.email);
    res.status(200).json({ message: "User deleted successfully." });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getProjectsData = async (req, res, next) => {
  try {
    let data = await Admin.getProjectsData(req.user.orgId);
    res.status(200).json({ projectData: data });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.getAllusersCount = async (req, res, next) => {
  try {
    let data = await Admin.getAllusersCount(req.user.orgId);
    res.status(200).json({ userCount: data });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};
exports.techDataCount = async (req, res, next) => {
  try {
    let data = await Admin.techDataCount(req.user.orgId);
    res.status(200).json({ techDataCount: data });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};
exports.getYearwiseCount = async (req, res, next) => {
  try {
    let yearWiseProject = await Admin.getYearwiseProjectCount(req.user.orgId);
    let data = await Admin.getYearwiseUserCount(req.user.orgId);
    res.status(200).json({
      yearWiseData: {
        yearWiseProjectCount: yearWiseProject,
        yearWiseUserCount: data,
      },
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};
