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
    var sql="select id,product_num,price,amount,name,pic,sell_rate,event from cart where id=?";
    connection.query(sql,[user_id],function(err,row){
      console.log(row);
      if(err) console.error("에러 발생 err: ",err);
				res.render('cart', { title: 'Cart', row, id:user_id});
      });
      connection.release();
  });
});

//글 조회 로직 처리 get
router.get('/delete/:name',function(req,res,next){
  var id = null;
  var session = req.session;
  id = session.user_id;
  var name = req.params.name;
  pool.getConnection(function(err,connection)
  {
    var sql="DELETE FROM cart WHERE name=? and id = ?";
    console.log("아이템과 아이디: ", name, id);

    connection.query(sql,[name,id],function(err,row)
    {
      if(err) console.error(err);
      console.log("장바구니의 아이템 삭제: ", row);
      res.redirect('/cart')
      connection.release();
    });
  });
});


module.exports = router;
