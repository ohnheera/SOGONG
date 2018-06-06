var express = require('express');
var router = express.Router();

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

/* GET home page. */
router.get('/', function(req, res, next) {
  var session = req.session;
  var id = session.user_id;
  console.log("id:", id);
  if(id){
    pool.getConnection(function(err, connection){
      var sql="select id,passwd,name,email,tel,address,gen,birth,pic,petname,petage,petbirth,petgen,pettype,interest0,interest1,interest2,interest3,point from userinfo where id = ?";
      connection.query(sql, [id], function(err, rows){
        if(err) res.send(err);
        console.log("사용자 정보 조회 결과 확인:", rows);
        var sql2="select id,product_num,price,amount,name,pic,sell_rate,event from cart where id = ?";
        connection.query(sql2, [id], function(err, row){
          if(err) console.error(err);
          console.log("장바구니 조회 결과 확인 : ", row);
          res.render('payment', { title: '결제창 ', id: id, row_user:rows[0], row_cart:row, leng: Object.keys(row).length});
          connection.release();
        });
      });
    });
  }
  else{
    res.redirect('/login');
  }
});

//주문완료 로직 처리 POST
router.post('/ordered', function(req, res, next){
  var session = req.session;
  var id = session.user_id;
  var date = new Date();
  var result = Math.floor(Math.random() * 200000) + 100000;

  if(id){
    pool.getConnection(function(err,connection){
      var sqlcart="select id,product_num,price,amount,name,pic,sell_rate,event from cart where id = ?";
      connection.query(sqlcart, [id], function(err,rowcart){
        if(err) res.send(err);
        console.log("장바구니 DB 조회 결과 확인: ", rowcart);
        var leng=Object.keys(rowcart).length;
        var product = '';
        var price = 0;
        var earnPoint=0;
        var ordernum=result;

        for(var i=0;i<leng;i++){
          product=product+rowcart[i].name+" "+rowcart[i].amount+"개"+" ";
          var origin = rowcart[i].price * rowcart[i].amount;
          var discount = origin * rowcart[i].event * 0.01;
          price = price + origin - discount;
        }

        earnPoint = price * 0.05;
        var datas = [product, date, price, id];

        var sql="insert into payment(product, date, price, id) values(?, ?, ?, ?)";
        connection.query(sql, datas, function(err, rows){
          if(err) res.send(err);
          console.log("주문DB 삽입 결과 확인:", rows);

          var sql2="delete from cart where id=?";
          connection.query(sql2, [id], function(err, row){
            if(err) console.error(err);
            console.log("장바구니 삭제 결과: ", row);

            var datas = [id, ordernum, earnPoint, date];
            var sql3="insert into point(id, order_num, point, date) values(?, ?, ?, ?)";
            connection.query(sql3, datas, function(err, rowpoint){
              if(err) res.send(err);
              console.log("point DB 삽입 결과 확인:", rowpoint);

              var sql4="update userinfo set point=? where id=?";
              connection.query(sql4, [earnPoint, id], function(err, rowuser){
                if(err) res.send(err);
                console.log("user DB 포인트 수정 결과 확인:", rowuser);
                res.render('ordered', { title: '결제완료', id: id});
                connection.release();
              });
            });
          });
        });
      });
    });
  }
  else{
    res.redirect('/login');
  }
});

module.exports = router;
