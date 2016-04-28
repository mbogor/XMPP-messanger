var express = require('express'); 
var morgan = require('morgan'); 
var bodyParser = require('body-parser'); 
var path = require('path');
var app = express();
var swig = require('swig');


var npmPath = path.join(__dirname, './node_modules');

// views 
app.set('views', __dirname + '/views');
app.set('view engine', 'html');
app.engine('html', swig.renderFile);

// logging and body parsing boilerplate
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));


// statically serve front end dependencies
app.use('/bootstrap', express.static(__dirname + '/node_modules/bootstrap/dist'));

// serve static files 
app.use(express.static(__dirname + '/public'));
app.use(express.static(npmPath));


// middleware for our dynamic routes 
app.use('/', require('./routes'));

//error handling logic (this is where next takes our error)
app.use(function(err, req, res, next){
  console.log('err: ', err)
  res.status(err.status || 500)
});

var port = 3000;; 

app.listen(port, function(){
  console.log('the server is listening on port: ', port)
})
