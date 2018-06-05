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
  pool.getConnection(function(err,connection)
  {
    if(err) console.error("커넥션 객체 얻어오기 에러 : ",err);
    var sql="select id,product_num,price,amount,name,pic,sale from cart where id=?";
    connection.query(sql,[id],function(err,row){
      console.log(row);
      if(err) console.error("에러 발생 err: ",err);
				res.render('cart', { title: 'Cart' , row, id:user_id});
      });
      connection.release();
  });
});


module.exports = router;
