var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var morgan = require('morgan');
var flash = require('connect-flash');

var passport = require('passport');

var expressSession = require('express-session');
//var User = require('./models/UserModel');


var initPassport = require('./routes/passport/init');
//console.log(initPassport)
initPassport(passport);

var routes = require('./routes/routes');
var login = require('./routes/login')(passport);

var app = express();

//app.use(expressSession({secret: 'mySecretKey'}));
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(flash());



app.use('/api', routes);
app.use('/auth', login);

app.use('/tempImg', express.static(__dirname + '/temp_image_dir'));


var mongoDB = ('mongodb://localhost/database');
mongoose.connect(mongoDB)
  .then(() => console.log('---DB connected---'))
  .catch((err) => console.log(err));

//for test
app.get('/', function(req, res){
  res.status(200).send('ok');
});

var server = app.listen(3001, function(){
  var port = server.address().port;
  console.log('server initiated listening at port %s', port);
});

module.exports = server;
