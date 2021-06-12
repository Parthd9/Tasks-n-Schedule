const Sprint = require("../models/sprint");
const Task = require("../models/task");
const Project = require("../models/project");
const { validationResult } = require("express-validator");
const SubTask = require("../models/subtask");
const helpers = require("../utils/helper");
const pdf = require("html-pdf");
const fs = require("fs");
const nodemailer = require("nodemailer");
const ObjectId = require("mongodb").ObjectId;

exports.getSprints = async (req, res, next) => {
  try {
    const pId = req.query.projectId;
    const vId = req.query.versionId;
    // console.log('pId:',pId);
    if (!pId && !vId) {
      const error = new Error("Invalid project id/ version id");
      error.statusCode = 403;
      throw error;
    }
    let sprints = await Sprint.getSprints(
      req.user.orgId,
      req.user.email,
      pId,
      vId
    );
    if (sprints) {
      res.status(200).json({ sprints: sprints });
    } else {
      res.status(200).json({ sprints: [] });
    }
  } catch (error) {
    console.log("error inside getSprints:", error);
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.addSprint = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    console.log(errors);

    const pId = req.query.projectId;
    const vId = req.query.versionId;
    // console.log('date',req.body.selectedDate);
    if (!pId && !vId) {
      const error = new Error("Invalid project id/ version id");
      error.statusCode = 403;
      throw error;
    }

    if (!errors.isEmpty()) {
      const error = new Error("Validation failed. Sprint name must be unique.");
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }

    const sprint = new Sprint(
      req.body.title,
      req.body.desc,
      req.user.orgId,
      req.user.email,
      req.body.selectedDate,
      pId,
      vId
    );
    let sprintData = await sprint.save(undefined);
    let sprintDoc = {
      _id: sprintData["ops"][0]["_id"],
      creator: sprintData["ops"][0]["creator"],
      name: sprintData["ops"][0]["name"],
      description: sprintData["ops"][0]["description"],
      completionDate: sprintData["ops"][0]["completionDate"],
    };
    res.status(201).json({
      message: "Sprint added successfully.",
      status: "success",
      data: sprintDoc,
    });
  } catch (err) {
    console.log("err inside addSprint:", err);
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.editSprint = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    console.log(errors);

    const pId = req.query.projectId;
    const vId = req.query.versionId;
    // console.log('date',req.body.selectedDate);
    if (!pId && !vId) {
      const error = new Error("Invalid project id/ version id");
      error.statusCode = 403;
      throw error;
    }

    if (!errors.isEmpty()) {
      const error = new Error("Validation failed. Sprint name must be unique.");
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }

    const sprint = new Sprint(
      req.body.title,
      req.body.desc,
      req.user.orgId,
      req.user.email,
      req.body.selectedDate,
      pId,
      vId
    );
    await sprint.save(req.body.id);
    res.status(202).json({ message: "Sprint updated successfully." });
  } catch (err) {
    console.log("err inside editSprint:", err);
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getMailList = async (req, res, next) => {
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
      const error = new Error("Validation failed. Sprint name must be unique.");
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }

    let result = await Sprint.getMailList(req.user.orgId, pId);
    if (!result) {
      res.status(200).json({ list: [] });
    } else {
      res.status(200).json({
        list: [
          ...result[0]["team"],
          {
            name: req.user.firstName + " " + req.user.lastName,
            email: req.user.email,
            role: req.user.role,
          },
        ],
      });
    }
  } catch (err) {
    console.log("err inside getMailList:", err);
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

// Method for Report
exports.generateReport = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    console.log(errors);

    const pId = req.query.projectId;
    const vId = req.query.versionId;
    const sId = req.query.sprintId;

    if (!pId && !vId) {
      const error = new Error("Invalid project id/ version id");
      error.statusCode = 403;
      throw error;
    }

    if (!errors.isEmpty()) {
      const error = new Error("Validation failed. Sprint name must be unique.");
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }

    let projectData = "";
    let sprintData = "";
    let spentTimeData = "";
    let uniqueDevs = "";

    let data = await Project.getProjectById(req.user.orgId, pId);
    if (!data) {
      projectData = {};
    } else {
      projectData = data[0];
      let team = projectData["team"];
      const arr = [];
      team = team.map((member) => {
        if (member["role"] === "Assurance") {
          arr.push(member);
        }
      });
      delete projectData["team"];
      projectData = { ...projectData, team: arr };
    }
    let sprintsData = await Sprint.getSprintById(req.user.orgId, pId, vId, sId);
    if (!sprintsData) {
      sprintData = {};
    } else {
      sprintData = sprintsData;
    }
    let sprintTimeData = await SubTask.getSpentTimeBySprint(
      new ObjectId(req.user.orgId),
      sId
    );
    if (!sprintTimeData) {
      spentTimeData = {};
    } else {
      spentTimeData = sprintTimeData;
    }
    let uniqueDevlopers = await Task.getUniqueDevelopers(req.user.orgId, sId);
    if (!uniqueDevlopers) {
      uniqueDevs = {};
    } else {
      uniqueDevs = uniqueDevlopers;
    }
    let developers = [];
    let devs = "";

    uniqueDevs.map((dev) => {
      developers.push(dev["uniqueValues"][0]);
    });
    for (let i = 0; i < developers.length; i++) {
      devs = devs + developers[i];
      if (i < developers.length - 1) {
        devs = devs + ", ";
      }
    }

    let totalEstTime = 0;
    let totalSpentTime = 0;
    let totalCompleted = 0;
    let totalCount = spentTimeData.length;
    for (let i = 0; i < spentTimeData.length; i++) {
      totalSpentTime += spentTimeData[i]["spentTime"];
      totalEstTime += spentTimeData[i]["taskDetails"]["estimatedTime"];
      if (spentTimeData[i]["taskDetails"]["status"] === "Completed") {
        totalCompleted += 1;
      }
    }
    let reportData = {
      sprintName: sprintData[0]["name"],
      sprintStartDate: helpers.formatDate(sprintData[0]["updatedAt"]),
      sprintCompletionDate: helpers.formatDate(sprintData[0]["completionDate"]),
      productOwner: "Marcus",
      DevelopmentTeam: devs,
      AssuranceTeam: helpers.getSeparatedArray(projectData["team"]),
      scrumMaster: req.user.firstName + " " + req.user.lastName,
      spentTimeData: spentTimeData,
      totalEstTime: totalEstTime,
      totalSpentTime: totalSpentTime,
      totalCompleted: totalCompleted,
      totalItems: totalCount,
    };
    console.log("report Data:", reportData);

    // Generating report

    let options = {
      quality: "100",
      border: {
        //   "top": "2in",            // default is 0, units: mm, cm, in, px
        //   "right": "1in",
        bottom: "2mm",
        //   "left": "1.5in"
      },

      paginationOffset: 1, // Override the initial pagination number
      header: {
        height: "15mm",
        contents: {
          first: `<h2 style="text-align: center;">${projectData["name"]}</h2><hr>`,
        },
      },
      footer: {
        height: "15mm",
        contents: {
          first: "1",
          2: "2", // Any page number is working. 1-based index
          // default: '<span style="color: #444;">{{page}}</span>/<span>{{pages}}</span>', // fallback value
        },
      },
    };
    // res.render('report.ejs');
    res.render("report.ejs", { reportData: reportData }, function (err, html) {
      pdf
        .create(html, options)
        .toFile("./files/sprint-report.pdf", function (err, res) {
          if (err) {
            console.log("error while genrating pdf:", err);
          } else {
            const toList = helpers.getSeparatedMailIds(req.body.list["toList"]);
            const ccList =
              req.body.list["ccList"].length > 0
                ? helpers.getSeparatedMailIds(req.body.list["ccList"])
                : "";
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
              to: toList,
              cc: ccList,
              subject: `${req.user.orgName} - ${projectData["name"]} - ${reportData["sprintName"]} -Report`,
              html:
                "<h4>Hello there,</h4>\n" +
                `<p>Please find latest report of sprint held between ${reportData.sprintStartDate} - ${reportData.sprintCompletionDate}</p>\n
                            <p><strong>This is auto-generated report and mail. </strong>Please do reach out project team in case of concern.</p>\n
                            <p>Thanks!</p>\n<p>--</p>\n<p>Team TnS</p>`,
              attachments: [
                {
                  // Use a URL as an attachment
                  filename: `${reportData["sprintName"]} - Report.pdf`,
                  path: "./files/sprint-report.pdf",
                },
              ],
            };

            transporter.sendMail(mailOptions, function (error, info) {
              if (error) {
                console.log(error);
              } else {
                fs.unlink("./files/sprint-report.pdf", (err) =>
                  console.log(err)
                );
                // console.log('Email sent: ' + info.response);
              }
            });
          }
        });
    });
    res.status(200).json({ message: "Mail sent successfully." });
  } catch (err) {
    console.log("err inside report generation:", err);
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
