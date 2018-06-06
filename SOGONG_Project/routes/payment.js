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
        console.log("사용자 정보 조회 결과 확인 :", rows);
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
  var product_names=[];
  var category=[];
  var product_amounts=[];

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
          product_names[i]=rowcart[i].name;
          category[i]=rowcart[i].product_num;
          product_amounts[i]=rowcart[i].amount;
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

                for(var i=0;i<leng;i++){
                    if(category[i]==0){
                      var sql5="update product_food set sell_rate = ? where prd_name=?";
                      var sql6="select sell_rate from product_food where prd_name = ?";
                    }
                    else if(category[i]==1){
                      var sql5="update product_clothes set sell_rate = ? where prd_name=?";
                      var sql6="select sell_rate from product_clothes where prd_name = ?";
                    }
                    else if(category[i]==2){
                      var sql5="update product_toy set sell_rate = ? where prd_name=?";
                      var sql6="select sell_rate from product_toy where prd_name = ?";
                    }
                    else if(category[i]==3){
                      var sql5="update product_health set sell_rate = ? where prd_name=?";
                      var sql6="select sell_rate from product_health where prd_name = ?";
                    }
                  }
                  var prdname = product_names[i];
                  var amount = product_amounts[i];

                  connection.query(sql6, [prdname], function(err, sellrate){
                    if(err) res.send(err);
                    console.log("물건 sell rate 확인:", sellrate);
                    var sell_rate=sellrate[0].sell_rate + amount;

                    connection.query(sql5, [sell_rate, prdname], function(err, rowproduct){
                      if(err) res.send(err);
                      console.log("물건 sell rate 증가", rowproduct);
                    });
                  });

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
