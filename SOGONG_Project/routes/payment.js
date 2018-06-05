var express = require('express');
var router = express.Router();

//mysql 코드
var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit:5,
  host:'localhost',
  user:'root',
  database:'project3',
  password:'12345'
});

/* GET home page. */
router.get('/', function(req, res, next) {
  var session = req.session;
  var id = session.user_id;
  console.log("id: ", id);
  if(id){
    pool.getConnection(function(err, connection){
      var sql="select id,passwd,name,email,tel,address,gen,birth,pic,petname,petage,petbirth,petgen,pettype,interest0,interest1,interest2,interest3,point from userinfo where id = ?";
      connection.query(sql, [id], function(err, rows){
        if(err) res.send(err);
        console.log("사용자 정보 조회 결과 확인: ", rows);
        var sql2="select id,product_num,price,amount,name,pic,sale from cart";
        connection.query(sql2, function(err, row){
          if(err) console.error(err);
          console.log("장바구니 조회 결과 확인: ", row);
          res.render('payment', { title: '결제창 ', id: id, row_user:rows[0], row_cart:row, leng: Object.keys(row).length});
          connection.release();
        });
      });
    });
  }
  else{
    res.redirect('/login')
  }
});

router.post('/ordercomplete', function (req, res, next) {
  var passwd = req.body.passwd;
  var idx = req.body.idx;
  var datas = [idx, passwd];
  var sql = "delete from infoboard where idx=?";

    pool.getConnection(function(err, connection) {
        connection.query(sql, datas, function (err, rows) {
         //if (err) console.error('err', err);
         if(err) res.send(err);
         //console.log(idx + ", " + passwd);
         //console.log("rows : " + JSON.stringify(rows));
         res.render('ordercomplete', {title : "주문완료", id:session.user_id});
         connection.release();
       });
     });
 });
module.exports = router;
