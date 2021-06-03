const Version = require('../models/version');
const { validationResult } = require('express-validator');

exports.getVersions = (req, res, next) => {
    const pId= req.query.projectId;
    // console.log('pId:',pId);
    if(!pId) {
        const error = new Error('Invalid project id');
        error.statusCode = 403;
        throw error;
    }
    Version.getVersions(req.user.orgId, req.user.email, pId)
            .then(versions => {
                if(versions) {
                    res.status(200).json({versions:versions});
                } else {
                    res.status(200).json({versions:[]})
                }
            })
            .catch(error => {
                if(!error.statusCode) {
                    error.statusCode = 500;
                }
                next(error);
            });
};

exports.addVersion = (req, res, next) => {
    const errors = validationResult(req);
    console.log(errors);

    const pId= req.query.projectId;
    console.log('pId:',pId);

    if(!pId) {
        const error = new Error('Invalid project id');
        error.statusCode = 403;
        throw error;
    }


    if (!errors.isEmpty()) {
      const error = new Error('Validation failed. Version name must be unique.');
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }

    const version = new Version(req.body.title,req.body.desc,req.user.orgId,req.user.email, pId);
    version.save().then(versionData => {
        console.log('inserted data:',versionData['ops'][0]);
        let versionDoc = {
            _id: versionData['ops'][0]['_id'], 
            creator: versionData['ops'][0]['creator'],
            name: versionData['ops'][0]['name'],
            description: versionData['ops'][0]['description']
            };
        res.status(201).json({message: 'Version added successfully.',status: 'success', data: versionDoc});
    })
    .catch(err => {
        console.log('err inside addVersion:',err);
        if(!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    })
}