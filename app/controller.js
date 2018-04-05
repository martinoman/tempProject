/* jslint node: true */
"use strict";

var express = require('express');
var cookieParser = require('cookie-parser');
var router = express.Router();
router.use(cookieParser());
var model = require("./model.js");
var fileUpload = require('express-fileupload');
router.use(fileUpload());


router.get('/security', function (req, res){
  var securities = model.getSecurities();
  res.json({list: securities});
});

router.post('/addSecurity', function(req, res){
  model.addSecurity(req.body.id, req.body.name);
  console.log("Added the secuirty: " + req.body.name);
  res.json({name: req.body.name, quantity: req.body.quantity});
});

router.post('/addOrder', function(req, res){
  model.addOrder(req.body.id, req.body.security_id, req.body.type, req.body.price, req.body.quantity, req.body.uid);
  var lists = model.searchTrade(req.body.id, req.body.security_id, req.body.type, req.body.price, req.body.quantity, req.body.uid);
  var trades = lists[0];
  var removedIds = lists[1];
  console.log("Trades that just happened: " + trades + ". Removed Ids: " + removedIds);
  res.json({tradeList: trades, removedIds: removedIds});
});

router.post('/setUser', function (req, res) {
  model.setUser(req.body.name, req.body.email, req.body.address, function(err, data){
    res.json({id: data});
  });
});

router.get('/getSecurity/:secId', function(req, res){
  var obj = model.findSecurity(req.params.secId);
  res.json({obj: obj});
});

router.get('/getOrders/:secId', function(req, res){
  var orders = model.getOrders(req.params.secId);
  res.json({list: orders});
});

router.get('/getTrades/:secId', function(req, res){
  var trades = model.getTrades(req.params.secId);
  res.json({list: trades});
});


router.get('/getAds', function(req, res){
  var ads = model.getAds(function(err, data){
    res.json({list: data});
  });
});

router.get('/getUserAds/:userId', function(req, res){
  var ads = model.getUserAds(req.params.userId, function(err, data){
    res.json({list: data});
  });
});

router.get('/getAdById/:ad_id', function(req, res){
  model.getAdById(req.params.ad_id, function(err, data){
    res.json({ad: data});
  });
});

router.post('/addAd', function(req, res){
  model.addAd(req.body.user, req.body.name, req.body.description, req.body.price, req.body.category, req.body.file);
  res.json({file: "anon"});
});


router.get('/getBids/:ad_id', function(req, res){
  console.log("getting bid controller");
  model.getBids(req.params.ad_id, function(err, data){
    res.json({list: data});
  });
});

router.post('/addBid', function(req, res){
  model.addBid(req.body.price, req.body.ad_id, req.body.user, function(errr, data){
    res.json({lits: "bla"});
  });
});

router.get('/getCategoryAds/:category', function(req, res){
  model.getCategoryAds(req.params.category, function(err, data){
    res.json({list: data});
  });
});

router.get('/getHBid/:ad_id', function(req, res){
  model.getHBid(req.params.ad_id, function(err, data){
    res.json({bid: data});
  });
});

router.post('/sold', function(req, res){
  model.removeBids(req.body.ad);
  model.removeAd(req.body.ad);
  res.json({list: "anon"});
});


router.post('/updatePrice', function(req, res){
  model.updatePrice(req.body.ad_id, req.body.price);
  res.json({list: "anon"});
});


module.exports = router;








//plz
