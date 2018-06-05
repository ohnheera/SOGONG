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
        console.log("사용자 정보 조회 결과 확인:", rows);
        var sql2="select id,product_num,price,amount,name,pic,sell_rate,event from cart where id = ?";
        connection.query(sql2, [id], function(err, row){
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

//글쓰기 로직 처리 POST
router.post('/ordered', function(req, res, next){
  var session = req.session;
  var id = session.user_id;
  var product = req.body.product_name;
  var date = new Date(year, month, day, hours, minutes);
  var price = req.body.product_price;

  var datas = [product, date, price, id];
  console.log("date: ", date);
  if(id){
    pool.getConnection(function(err, connection){
      var sql="insert into payment(product, date, price, id) values(?, ?, ?, ?)";
      connection.query(sql, datas, function(err, rows){
        if(err) res.send(err);
        console.log("주문DB 삽입 결과 확인: ", rows);

        var sql2="delete from cart where id=?";
        connection.query(sql2, [id], function(err, row){
          if(err) console.error(err);
          console.log("장바구니 삭제 결과:", row);
          res.redirect('/cart');
          connection.release();
        });
      });
    });
  }
  else{
    res.redirect('/login')
  }
});

module.exports = router;
