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
  var id = null;
  var session = req.session;
  var user_id = session.user_id;
  var prd = 0;

  pool.getConnection(function(err,connection)
  {
    var sql="select idx,main_img,prd_name,prd_des,price from product_food where sell_rate = (select max(sell_rate)from product_food) UNION select idx,main_img,prd_name,prd_des,price from product_health where sell_rate = (select max(sell_rate)from product_health) UNION select idx,main_img,prd_name,prd_des,price from product_toy where sell_rate = (select max(sell_rate)from product_toy)";
    connection.query(sql,function(err,prd)
    {
      if(err) console.error(err);
      console.log("홈페이지를 위해 받아온 정보: ", prd);
      res.render('index',{title:"Home", prd, id:user_id});
      connection.release();
    });

  });
});

module.exports = router;
