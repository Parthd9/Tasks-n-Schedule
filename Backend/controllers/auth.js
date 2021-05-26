const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');

const Organization = require("../models/organization");
const User = require("../models/user");


exports.signup = (req, res, next) => {
    console.log(req.body);
    const fName = req.body.fName;
    const lName = req.body.lName;
    const email = req.body.email;
    const password = req.body.password;
    const orgName = req.body.orgName;
    const orgDomain = req.body.orgDomain;
    const org= new Organization(orgName, orgDomain);
    let org_id;
    org.save()
        .then(orgId=> {
            org_id = orgId;
            console.log(orgId);
            return bcrypt.hash(password, 10);
        })
        .then(hashedPassword => {
            const user = new User(fName,lName,email,hashedPassword,org_id);
            return user.save();
        })
        .then(userId => {
            console.log('User id:',userId);
            var transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                  user: 'tasknschedule@gmail.com',
                  pass: '<PASSWORD>'
                }
              });
            
              var mailOptions = {
                from: 'tasknschedule@gmail.com',
                to: email,
                subject: 'Welcome to Task-n-Schedule',
                html: "<h4>Dear "+fName+" "+lName+",</h4>\n"+
                "<p>Thank you for signing up to become a member of TnS.We’re thrilled to see you here!</p>\n"+
                "<p>We're confident that TnS will help you to manage your projects in an Agile environment with ease.</p>\n"+
                "<p>Do reach out us in case of any concern.</p><br>\n"+
                "<p>Thanks!</p>\n<p>--</p>\n<p>Team TnS</p>"
              };
              
              transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                  console.log(error);
                } else {
                  console.log('Email sent: ' + info.response);
                }
              });

            res.status(200).json({'message': 'Organization and Admin data registered successfully.'});
        })
        .catch(err=>console.log(err));
    
}

exports.login = (req, res, next) => {
    console.log(req.body);
    let fetchedUser;
    User.findUser(req.body)
        .then(user => {
          if(user) {
              console.log('user data:',user);
              fetchedUser = user;
              return bcrypt.compare(req.body.password, user.password);
          } else {
              return res.status(401).json({'message': 'Invalid credentials.'});
          }
        })
        .then(isPwdMatched => {
            if(isPwdMatched) {
                const token = jwt.sign(
                    {email: fetchedUser.email, role: fetchedUser.role},
                    '<SECRET-KEY>',
                    {expiresIn: '1h'}
                );

                return res.status(200).json({
                    token: token
                });

            } else {
              return res.status(401).json({'message': 'Invalid credentials.'});
            }
        })
        .catch(err => console.log(err));
};