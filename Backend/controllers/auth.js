const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");

const Organization = require("../models/organization");
const User = require("../models/user");
const helpers = require("../utils/helper");

exports.signup = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    console.log(errors);
    if (!errors.isEmpty()) {
      const error = new Error(
        "Validation failed. Organization name and admin email must be unique."
      );
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }
    const fName = req.body.fName;
    const lName = req.body.lName;
    const email = req.body.email;
    const password = req.body.password;
    const orgName = req.body.orgName;
    const orgDomain = req.body.orgDomain;
    const org = new Organization(orgName, orgDomain);

    let org_id = await org.save();

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User(
      fName,
      lName,
      email,
      hashedPassword,
      org_id,
      "Admin",
      orgName
    );

    await user.save();

    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "tasknschedule@gmail.com",
        pass: process.env.email,
      },
    });

    var mailOptions = {
      from: "tasknschedule@gmail.com",
      to: email,
      subject: "Welcome to Task-n-Schedule",
      html:
        "<h4>Dear " +
        fName +
        " " +
        lName +
        ",</h4>\n" +
        "<p>Thank you for signing up to become a member of TnS.We’re thrilled to see you here!</p>\n" +
        "<p>We're confident that TnS will help you to manage your projects in an Agile environment with ease.</p>\n" +
        "<p>Do reach out us in case of any concern.</p><br>\n" +
        "<p>Thanks!</p>\n<p>--</p>\n<p>Team TnS</p>",
    };
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        // console.log('Email sent: ' + info.response);
      }
    });

    res.status(200).json({
      message: "Organization and Admin data registered successfully.",
    });
  } catch (err) {
    console.log(err);
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    let fetchedUser = await User.findUser(req.body);
    let isPwdMatched;
    if (fetchedUser) {
      isPwdMatched = await bcrypt.compare(
        req.body.password,
        fetchedUser.password
      );
    } else {
      return res.status(401).json({ message: "Invalid credentials." });
    }
    if (isPwdMatched) {
      const token = jwt.sign(
        { email: fetchedUser.email, role: fetchedUser.role },
        process.env.JWT_KEY,
        { expiresIn: "1h" }
      );
      return res.status(200).json({
        token: token,
      });
    } else {
      return res.status(401).json({ message: "Invalid credentials." });
    }
  } catch (err) {
    console.log(err);
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
