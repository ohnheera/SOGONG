var express = require('express');
var router = express.Router();
var fs = require('fs');

router.use(express.static('public'));
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
  pool.getConnection(function(err, connection){
    var sql="select product, date, price, id from payment";
    connection.query(sql, function(err, rowpayment){
      if(err) res.send(err);
      console.log("판매 정보 조회 결과 확인:", rowpayment);
      res.render('chart', { title: '매출통계 ', id:user_id, row:rowpayment, leng: Object.keys(rowpayment).length});
      connection.release();
    });
  });
});


module.exports = router;
