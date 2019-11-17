const models = require('../models');
const Promise = require('bluebird');

module.exports.createSession = (req, res, next) => {
  Promise.resolve(req.cookies.shortlyid)
    .then(result => {
      if (!result) {

      } else {
        return models.Sessions.get({ result });
      }
    })
    .then(() => {
      return models.Sessions.create()
        .then(result => {
          return models.Sessions.get({ result });
        })
        .then(session => {
          return res.cookie('shortlyid', session.result);
        });
    })
    .then(session => {
      req.session = session;
      next();
    });
};

/************************************************************/
// Add additional authentication middleware functions below
/************************************************************/
