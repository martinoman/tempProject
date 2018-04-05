/* jslint node: true */
"use strict";

var model = require('./model.js');

module.exports = function (socket, io) {

  // user joins room
  socket.on('join', function (req) {
    var ad_id = req.ad_id;
    socket.join(ad_id);
    io.to(ad_id).emit('join', req);
  });

  socket.on('joinCategory', function(req){
    var cat = req.category;
    for (var i = 0; i < req.leave.length; i++) {
      socket.leave(req.leave[i]);
    }
    socket.join(cat);
    io.to(cat).emit('joinCategory', req);
  });

  socket.on('updateCategory', function(req){
    console.log("updating " + req.category);
    var cat = req.category;
    io.to(cat).emit('updateCategory', req);
  });

  // user gets updated
  socket.on('update', function (req) {
    var ad_id = req.ad_id;
    io.to(ad_id).emit('update', req);
  });

  // user leaves room
  socket.on('leave', function (req) {
    console.log(req);
    var name = req.name;
    var user = req.user;
    var room = model.findRoom(name);
    console.log('A user left ' + name);
    io.to(name).emit('leave', user);
  });

};
