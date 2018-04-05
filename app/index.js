var express = require('express');
var bodyParser = require('body-parser');
var http = require('http');
var expressSession = require('express-session');
var sharedsession = require('express-socket.io-session');

var port = 8080;

var app = express();
app.use(express.static(__dirname + '/../public'));
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
var session = expressSession({
    secret: "MoveFromHereOrTheSecretWillBeOnGit",
    resave: true,
    saveUninitialized: true,
  });
app.use(session);

var httpServer = http.Server(app);
var io = require('socket.io').listen(httpServer);
io.use(sharedsession(session));

var router = require('./controller.js');
app.use('/API', router);

var socketController = require('./socketController.js');
io.on('connection', function (socket) {
  socketController(socket, io);
});

var model = require('./model.js');


// model.getHBid(1, function(err, data){
//   console.log("data " + data);
// });

// model.setUser(5, "Patric", "Patricvägen 12", "patric@lantz.se", function(err, data){
//   console.log(data);
// });
//function(id, name, email, address, callback)

// model.getTradeOrders(1, "buy", 15, 9, "");
//id, security_id, price, quantity, timeStamp, buyer, seller


httpServer.listen(port, function () {
  console.log("server listening on port", port);
});
