const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');

const User = require('../models/user');
const helper = require('../utils/helper');
const Admin = require('../models/admin');

const { validationResult } = require('express-validator');

exports.addUser = (req, res, next) => {
    console.log('data:',req.body);
    console.log('persisted user:',req.user);

    const errors = validationResult(req);
    console.log(errors);
    if (!errors.isEmpty()) {
      const error = new Error('Validation failed. Please enter user-data in valid format.');
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }

    let password = helper.getRandomString(6);
    console.log('Password:',password);

    bcrypt.hash(password, 10)
          .then(hashedPwd => {
            if(!hashedPwd) {
              const error = new Error('Something went wrong');
              error.statusCode = 500;
              throw error;
            }
            const user = new User(req.body.fname, req.body.lname, req.body.email, hashedPwd, req.user.orgId, req.body.role, req.user.orgName);
            return user.save();
          })
          .then(result => {
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
                to: req.body.email,
                subject: 'Welcome to Task-n-Schedule',
                html: "<h4>Dear "+req.body.fname+" "+req.body.lname+",</h4>\n"+
                `<p>Your credentials has been created by admin ${req.user.email}</p>\n
                <p>Role: <strong>${req.body.role}</strong></p>
                <p>Login id: <strong>${req.body.email}</strong></p>\n
                <p>Generated password: <strong>${password}</strong></p>\n
                <p>Please use above credentials to login.</p>
                <p>Thanks!</p>\n<p>--</p>\n<p>Team TnS</p>`
              };
              
              transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                  console.log(error);
                } else {
                  // console.log('Email sent: ' + info.response);
                }
              });
              let userDoc = {
                _id: result['ops'][0]['_id'],
                firstName: result['ops'][0]['firstName'],
                lastName: result['ops'][0]['lastName'],
                email: result['ops'][0]['email'], 
                role: result['ops'][0]['role']
                };
    
              res.status(201).json({user : userDoc});
        })
        .catch(err => {
            if(!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
}

exports.getUsers = (req, res, next) => {
  User.findUsersByOrgId(req.user.orgId)
      .then(usersDoc => {
        console.log('usersdoc',usersDoc);
        if(usersDoc) {
          res.status(200).json({users: usersDoc});
        } else {
          res.status(200).json({users: []});
        }
      })
      .catch(error => {
        if(!error.statusCode) {
          error.statusCode = 500;
        }
        next(error);
      });
}

exports.editUser = (req, res, next) => {
  console.log('data:',req.body);
  // console.log('persisted user:',req.user);
  const fname = req.body.fname;
  const userId = req.body.id;
  const lname = req.body.lname;
  const role = req.body.role;

  const errors = validationResult(req);
  console.log(errors);

  if (!errors.isEmpty()) {
    const error = new Error('Validation failed. Please enter user-data in valid format.');
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }
      return User.updateUser(fname, lname, role, userId)
        .then(result => {
            res.status(202).json({message: 'User updated successfully.'});
      })
      .catch(err => {
          if(!err.statusCode) {
              err.statusCode = 500;
          }
          next(err);
      });
}

exports.removeUser = (req,res, next) => {
  User.removeUser(req.user.orgId, req.body.id)
  .then(result => {
      res.status(200).json({message: 'User deleted successfully.'});
})
.catch(err => {
    if(!err.statusCode) {
        err.statusCode = 500;
    }
    next(err);
});
}

exports.getProjectsData = (req, res, next) => {
    Admin.getProjectsData(req.user.orgId)
    .then(data => {
      console.log('proj data:',data);
      res.status(200).json({projectData: data});
    })
    .catch(error => {
      if(!error.statusCode) {
          error.statusCode = 500;
      }
      next(error);
  });
}
