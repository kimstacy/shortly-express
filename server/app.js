const express = require('express');
const path = require('path');
const utils = require('./lib/hashUtils');
const partials = require('express-partials');
const bodyParser = require('body-parser');
const Auth = require('./middleware/auth');
const models = require('./models');

const app = express();

app.set('views', `${__dirname}/views`);
app.set('view engine', 'ejs');
app.use(partials());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));



app.get('/', (req, res) => {
  res.render('index');
});

app.get('/create', (req, res) => {
  res.render('index');
});

app.get('/links', (req, res, next) => {
  models.Links.getAll()
    .then(links => {
      res.status(200).send(links);
    })
    .error(error => {
      res.status(500).send(error);
    });
});

app.post('/links', (req, res, next) => {
  var url = req.body.url;
  if (!models.Links.isValidUrl(url)) {
    // send back a 404 if link is not valid
    return res.sendStatus(404);
  }

  return models.Links.get({ url })
    .then(link => {
      if (link) {
        throw link;
      }
      return models.Links.getUrlTitle(url);
    })
    .then(title => {
      return models.Links.create({
        url: url,
        title: title,
        baseUrl: req.headers.origin
      });
    })
    .then(results => {
      return models.Links.get({ id: results.insertId });
    })
    .then(link => {
      throw link;
    })
    .error(error => {
      res.status(500).send(error);
    })
    .catch(link => {
      res.status(200).send(link);
    });
});

/************************************************************/
// Write your authentication routes here
/************************************************************/

// Render login page
app.get('/login', (req, res) => {
  res.render('login');
});

app.post('/login', (req, res, next) => {
  var username = req.body.username;
  var password = req.body.password;

  models.Users.compare(req.body.password, user.password, user.salt);

  next();
});

// Render signup page
app.get('/signup', (req, res) => {
  res.render('signup');
});

app.post('/signup', (req, res, next) => {
  // check database if username already exists
  var username = req.body.username;
  var password = req.body.password;

  // if true then dont create new user
  return models.Users.get({username})
    .then(user => {
      // if user exists
      if (user) {
        throw new Error('User already exists'); // or throw user on line 122
      // if user doesn't exist
      } else { // create new user w/ pw
        return models.Users.create({ username, password });
      }
    })

    .then((user) => {
      // {throw user};
    // .error(error => res.status(500).send(error));
      // User isLoggedIn, createSession
      // Sessions.create() will create a new session; a hash is randomly generated
      // session - id, hash, userId
      // isLoggedIn takes in a session
      // createSession
      res.redirect('/');
      var session = models.Sessions.create();
      console.log('session ', session);
      models.Sessions.isLoggedIn(session);
      // login({ username password })
      // login with username and password
      // start session
    })
    .catch((error) => {
      console.log(error);
      res.redirect('/signup');
    });

  next();
});

/************************************************************/
// Handle the code parameter route last - if all other routes fail
// assume the route is a short code and try and handle it here.
// If the short-code doesn't exist, send the user to '/'
/************************************************************/

app.get('/:code', (req, res, next) => {

  return models.Links.get({ code: req.params.code })
    .tap(link => {

      if (!link) {
        throw new Error('Link does not exist');
      }
      return models.Clicks.create({ linkId: link.id });
    })
    .tap(link => {
      return models.Links.update(link, { visits: link.visits + 1 });
    })
    .then(({ url }) => {
      res.redirect(url);
    })
    .error(error => {
      res.status(500).send(error);
    })
    .catch(() => {
      res.redirect('/');
    });
});

module.exports = app;
