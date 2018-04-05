// orders/* jslint node: true */
"use strict";

/**
 * A module that contains the main system object!
 * @module roomSystem
 */

var mysql = require('mysql');

var connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "aktionera"
});

connection.connect(function(err){
  if(err) throw err;
  console.log("connection");
});

exports.removeBids = function(ad){
  var stmt = "delete from bid where ad=" + connection.escape(ad.ad_id);
  console.log(stmt);

  connection.query(stmt, function(err, result){
    if (err){
      console.log("error i removeBids query");
    };
  });
};

exports.removeAd = function(ad){
  var stmt = "delete from ad where ad_id=" + connection.escape(ad.ad_id);
  console.log(stmt);

  connection.query(stmt, function(err, result){
    if (err){
      console.log("error i removeBids query");
    };
  });
};

exports.updatePrice = function(ad_id, price){
  var stmt = "update ad set price=" + connection.escape(price) + " where ad_id=" + connection.escape(ad_id);
  console.log(stmt);
  connection.query(stmt, function(err, result){
    if (err){
      console.log("error i removeBids query");
    };
  });
};



exports.getHBid = function(ad_id, callback){
  //alternativt om vi cill selecta endast bid_id och sen hämta det specifika budet efter det
  var stmt = "select * from bid where price=(select max(price) from bid where ad=" + connection.escape(ad_id) + ")"
  console.log(stmt);

  connection.query(stmt, function(err, result){
    if (err){
      callback(err,null);
    }else{
      callback(null,result);
      console.log("high bid res "+ result);
    }
  });
};


exports.getAds = function(callback){
  var ads;
  connection.query("select * from ad", function(err, result){
    if (err){
      callback(err,null);
    }else{
      callback(null,result);
    }
  });
};

exports.getUserAds = function(userId, callback){
  var stmt = "select * from ad where user = " + connection.escape(userId);
  console.log(stmt);
  connection.query(stmt, function(err, result){
    if (err){
      console.log("Fel i queryet");
      callback(err,null);
    }else{
      callback(null,result);
    }
  });
};

exports.setUser = function(name, email, address, callback){
  var stmt = "insert into user (name, address, email) values (" + connection.escape(name) + ", " + connection.escape(address) + ", " + connection.escape(email) + ")";
  console.log(stmt);
  connection.query(stmt, function(err, result){
    if(err){
      callback(err, null);
    }
  });
  connection.query("select last_insert_id()", function(err, result){
    if (err){
      console.log("Fel i queryet");
      callback(err,null);
    }else{
      callback(null,result);
    }
  });
};

exports.getBids = function(ad_id, callback){
  var stmt = "select * from bid where ad=" + connection.escape(ad_id);

  connection.query(stmt, function(err, result){
    if (err){
      callback(err,null);
    }else{
      callback(null,result);
    }
  });
};

exports.addBid = function(price, ad_id, user, callback){
  var stmt = "insert into bid (price, ad, user) values (" + connection.escape(price) + ', ' + connection.escape(ad_id) + ', ' + connection.escape(user) + ')';
  console.log(stmt);

  connection.query(stmt, function(err, result){
    if (err){
      callback(err,null);
    }else{
      callback(null,result);
    }
  });
};

//addBid(req.body.price, req.body.ad, req.body.user)


exports.addAd = function(user, name, description, price, category, file_name){
  var stmt = "insert into ad (user, name, description, price, category, file_name) values (" + connection.escape(user) + ", " + connection.escape(name) + ", " + connection.escape(description) + ", " + connection.escape(price) + ", " + connection.escape(category) + ", " + connection.escape(file_name)+ ")";
  console.log(stmt);
  connection.query(stmt, function(err, result){
    console.log("result " + result);
  });
};

exports.getAdById = function(id, callback){
  var stmt = "select * from ad where ad_id=" + connection.escape(id);
  console.log(stmt);

  connection.query(stmt, function(err, result){
    if (err){
      callback(err,null);
    }else{
      callback(null,result);
    }
  });
};

exports.getCategoryAds = function(category, callback){
  var stmt = "select* from ad where category=" + connection.escape(category);
  // console.log(stmt);

  connection.query(stmt, function(err, result){
   if (err){
      callback(err,null);
    }else{
      callback(null,result);
    }
  });
};
