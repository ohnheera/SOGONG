//희라 : 장바구니

var express = require('express');
var router = express.Router();
var fs = require('fs');

//mysql 코드
var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit:5,
  host:'localhost',
  user:'root',
  database:'project3',
  password:'12345'
});

router.get('/', function(req, res, next) {
  var id = null;
  var session = req.session;
  var user_id = session.user_id;
  res.render('cart', { title: 'Cart' , id:user_id});
});


module.exports = router;
