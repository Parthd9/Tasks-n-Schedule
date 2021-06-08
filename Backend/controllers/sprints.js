const Sprint = require('../models/sprint');
const Task = require('../models/task');
const Project = require('../models/project');
const { validationResult } = require('express-validator');
const SubTask = require('../models/subtask');
const helpers = require('../utils/helper');
const pdf = require('html-pdf');
const fs = require('fs');
const nodemailer = require('nodemailer');
const ObjectId = require('mongodb').ObjectId;

exports.getSprints = (req, res, next) => {
    const pId= req.query.projectId;
    const vId= req.query.versionId;
    // console.log('pId:',pId);
    if(!pId && !vId) {
        const error = new Error('Invalid project id/ version id');
        error.statusCode = 403;
        throw error;
    }
    Sprint.getSprints(req.user.orgId, req.user.email, pId, vId)
            .then(sprints => {
                if(sprints) {
                    res.status(200).json({sprints:sprints});
                } else {
                    res.status(200).json({sprints:[]})
                }
            })
            .catch(error => {
                if(!error.statusCode) {
                    error.statusCode = 500;
                }
                next(error);
            });
}

exports.addSprint = (req, res, next) => {
    const errors = validationResult(req);
    console.log(errors);

    const pId= req.query.projectId;
    const vId= req.query.versionId;
    // console.log('date',req.body.selectedDate);
    if(!pId && !vId) {
        const error = new Error('Invalid project id/ version id');
        error.statusCode = 403;
        throw error;
    }

    if (!errors.isEmpty()) {
      const error = new Error('Validation failed. Sprint name must be unique.');
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }

    const sprint = new Sprint(req.body.title,req.body.desc,req.user.orgId,req.user.email,req.body.selectedDate,pId, vId);
    sprint.save(undefined).then(sprintData => {
        console.log('inserted data:',sprintData['ops'][0]);
        let sprintDoc = {
            _id: sprintData['ops'][0]['_id'], 
            creator: sprintData['ops'][0]['creator'],
            name: sprintData['ops'][0]['name'],
            description: sprintData['ops'][0]['description']
            };
        res.status(201).json({message: 'Sprint added successfully.',status: 'success', data: sprintDoc});
    })
    .catch(err => {
        console.log('err inside addSprint:',err);
        if(!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    })
}

exports.editSprint = (req,res,next) => {
    const errors = validationResult(req);
    console.log(errors);

    const pId= req.query.projectId;
    const vId= req.query.versionId;
    // console.log('date',req.body.selectedDate);
    if(!pId && !vId) {
        const error = new Error('Invalid project id/ version id');
        error.statusCode = 403;
        throw error;
    }

    if (!errors.isEmpty()) {
      const error = new Error('Validation failed. Sprint name must be unique.');
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }

    const sprint = new Sprint(req.body.title,req.body.desc,req.user.orgId,req.user.email,req.body.selectedDate,pId, vId);
    console.log('id:',req.body.id);
    sprint.save(req.body.id).then(sprintData => {
        res.status(202).json({message: 'Sprint updated successfully.'});
    })
    .catch(err => {
        console.log('err inside editSprint:',err);
        if(!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    })
}

exports.getMailList = (req, res, next) => {
    const errors = validationResult(req);
    console.log(errors);

    const pId= req.query.projectId;

    if(!pId) {
        const error = new Error('Invalid project id');
        error.statusCode = 403;
        throw error;
    }

    if (!errors.isEmpty()) {
      const error = new Error('Validation failed. Sprint name must be unique.');
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }

    Sprint.getMailList(req.user.orgId, pId)
            .then(result => {
                if(!result) {
                    res.status(200).json({list: []})
                } else {
                    console.log('result:', result)
                    res.status(200).json({list: [...result[0]['team'], {name: req.user.firstName+' '+req.user.lastName, email: req.user.email, role: req.user.role}]});
                }
            })
            .catch(err => {
                console.log('err inside getMailList:',err);
                if(!err.statusCode) {
                    err.statusCode = 500;
                }
                next(err);
        });
}

// Method for Report
exports.generateReport = (req, res, next) => {
    const errors = validationResult(req);
    console.log(errors);

    const pId= req.query.projectId;
    const vId= req.query.versionId;
    const sId = req.query.sprintId;
    console.log('data:',req.body.list);
    if(!pId && !vId) {
        const error = new Error('Invalid project id/ version id');
        error.statusCode = 403;
        throw error;
    }

    if (!errors.isEmpty()) {
      const error = new Error('Validation failed. Sprint name must be unique.');
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }

    let projectData = '';
    let sprintData = '';
    let spentTimeData = '';
    let uniqueDevs = '';

    Project.getProjectById(req.user.orgId, pId)
            .then(data => {
                if(!data) {
                    projectData = {};
                } else {
                    projectData = data[0];
                    let team = projectData['team'];
                    const arr = [];
                    team = team.map(member => {
                        
                        console.log('member:',member)
                        
                        if(member['role']==='Assurance') {
                            arr.push(member);
                        }
                    });
                    delete projectData['team'];
                    projectData = {...projectData, team: arr};
                    console.log(projectData);
                }
                return Sprint.getSprintById(req.user.orgId, pId, vId, sId);
            })
            .then(data => {
                if(!data) {
                    sprintData = {};
                } else {
                    sprintData = data;
                    console.log('sprintData:',sprintData);
                }
                return SubTask.getSpentTimeBySprint(new ObjectId(req.user.orgId), sId);
            })
            .then(data => {
                if(!data) {
                    spentTimeData = {};
                } else {
                    spentTimeData = data;
                    console.log('spentTimeData:',spentTimeData);

                }
                return Task.getUniqueDevelopers(req.user.orgId, sId);
            })
            .then(data => {
                if(!data) {
                    uniqueDevs = {};
                } else {
                    uniqueDevs = data;
                    console.log('uniqueDevs:',uniqueDevs);
                }
                let developers = [];
                let devs = '';
                console.log('len:',uniqueDevs.length);
                uniqueDevs.map(dev => {

                    console.log('data2:',uniqueDevs[0]['_id'])
                    developers.push(dev['uniqueValues'][0]);
                  })
                for(let i=0; i<developers.length; i++ ) {
                    devs = devs + developers[i];
                    if(i < developers.length-1) {
                        devs = devs + ', ';
                    }
                }
                console.log('projectdadta:',projectData['team']);
                let totalEstTime =0;
                let totalSpentTime = 0;
                let totalCompleted =0;
                let totalCount = spentTimeData.length;
                for(let i=0; i<spentTimeData.length; i++) {
                    totalSpentTime += spentTimeData[i]['spentTime'];
                    totalEstTime += spentTimeData[i]['taskDetails']['estimatedTime'];
                    if(spentTimeData[i]['taskDetails']['status'] === 'Completed') {
                        totalCompleted += 1;
                    }
                }
                let reportData = {
                    
                   sprintName: sprintData[0]['name'],
                   sprintStartDate:   helpers.formatDate(sprintData[0]['updatedAt']),
                   sprintCompletionDate: helpers.formatDate(sprintData[0]['completionDate']),
                   productOwner: 'Marcus',
                   DevelopmentTeam: devs,
                   AssuranceTeam: helpers.getSeparatedArray(projectData['team']),
                   scrumMaster: req.user.firstName + ' '+ req.user.lastName,
                   spentTimeData: spentTimeData,
                   totalEstTime: totalEstTime,
                   totalSpentTime: totalSpentTime,
                   totalCompleted: totalCompleted,
                   totalItems: totalCount
                }

                // Generating report

                let options = {
                    "quality": "100",
                    "border": {
                    //   "top": "2in",            // default is 0, units: mm, cm, in, px
                    //   "right": "1in",
                    "bottom": "2mm",
                    //   "left": "1.5in"
                    },
                
                    paginationOffset: 1,       // Override the initial pagination number
                    "header": {
                    "height": "15mm",
                    "contents": {
                        first: `<h2 style="text-align: center;">${projectData['name']}</h2><hr>`
                    }
                    },
                    "footer": {
                    "height": "15mm",
                    "contents": {
                        first: '1',
                        2: '2', // Any page number is working. 1-based index
                        // default: '<span style="color: #444;">{{page}}</span>/<span>{{pages}}</span>', // fallback value
                        
                    }
                    },
                }
                // res.render('report.ejs');
                res.render('report.ejs', {reportData: reportData},function (err, html) {
                    pdf.create(html, options).toFile('./files/sprint-report.pdf',function (err, res) {
                    if (err) {
                        console.log(err);
                    }
                    else { 
                        console.log(res); 
                        const toList = helpers.getSeparatedMailIds(req.body.list['toList']);
                        const ccList = req.body.list['ccList'].length > 0 ? helpers.getSeparatedMailIds(req.body.list['ccList']) : '';
                        var transporter = nodemailer.createTransport({
                            service: 'gmail',
                            auth: {
                              user: 'tasknschedule@gmail.com',
                              pass: ''
                            }
                          });
                        
                          let from = `<tasknschedule@gmail.com> On Behalf of <${req.user.email}>`;
                          var mailOptions = {
                            from: from,
                            to: toList,
                            cc: ccList,
                            subject: `${req.user.orgName} - ${projectData['name']} - ${reportData['sprintName']} -Report`,
                            html: "<h4>Hello there,</h4>\n"+
                            `<p>Please find latest report of sprint held between ${reportData.sprintStartDate} - ${reportData.sprintCompletionDate}</p>\n
                            <p><strong>This is auto-generated report and mail. </strong>Please do reach out project team in case of concern.</p>\n
                            <p>Thanks!</p>\n<p>--</p>\n<p>Team TnS</p>`,
                            attachments: [
                                { // Use a URL as an attachment
                                  filename: `${reportData['sprintName']} - Report.pdf`,
                                  path: './files/sprint-report.pdf'
                              }
                            ]
                          };
                          
                          transporter.sendMail(mailOptions, function(error, info){
                            if (error) {
                              console.log(error);
                            } else {
                                fs.unlink('./files/sprint-report.pdf', err => console.log(err));
                              // console.log('Email sent: ' + info.response);
                            }
                          });
                    }
                    });
                });
                res.json({});
            })
            .catch(err => {
                console.log('err inside addSprint:',err);
                if(!err.statusCode) {
                    err.statusCode = 500;
                }
                next(err);
            });
}