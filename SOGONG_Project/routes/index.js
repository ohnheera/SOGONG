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
    var sql1 = "SELECT idx,main_img,prd_name,prd_des,price,sell_rate FROM product_food UNION ALL SELECT idx,main_img,prd_name,prd_des,price,sell_rate FROM  product_toy UNION ALL SELECT idx,main_img,prd_name,prd_des,price,sell_rate FROM  product_health UNION ALL SELECT idx,main_img,prd_name,prd_des,price,sell_rate FROM  product_clothes ORDER BY sell_rate LIMIT 3"
    //best3
    var sql2 = "SELECT idx,main_img,prd_name,prd_des,price,event FROM product_food WHERE event > 0  UNION ALL SELECT idx,main_img,prd_name,prd_des,price,event FROM product_health WHERE event > 0  UNION ALL SELECT idx,main_img,prd_name,prd_des,price,event FROM product_toy WHERE event > 0  UNION ALL SELECT idx,main_img,prd_name,prd_des,price,event FROM product_clothes WHERE event > 0 ORDER BY event LIMIT 1";
    //event중인 prd
    var sql3 = "SELECT idx,main_img,prd_name,prd_des,price FROM product_food WHERE td_special > 0  UNION ALL SELECT idx,main_img,prd_name,prd_des,price FROM product_health WHERE td_special > 0  UNION ALL SELECT idx,main_img,prd_name,prd_des,price FROM product_toy WHERE td_special > 0  UNION ALL SELECT idx,main_img,prd_name,prd_des,price FROM product_clothes WHERE td_special > 0 ORDER BY idx LIMIT 1";
    //오늘의 특가, 4개의 table에서

    //prd에 들어가는 정보
    //0: best from food / 1: best from health / 2: best from toy
    //3: event / 4: today's deal / 5: match to user
    //6: new1 / 7: new2 / 8 new3

    connection.query(sql1 ,function(err,prd1)
    {
      if(err) console.error(err);
      console.log("BEST3: ", prd1);
      connection.query(sql2 ,function(err,prd2)
      {
        if(err) console.error(err);
        console.log("EVENT: ", prd2);
        connection.query(sql3 ,function(err,prd3)
        {
          if(err) console.error(err);
          console.log("특가: ", prd3);


          res.render('index',{title:"Home", prd1,prd2,prd3, id:user_id});
          connection.release();
        });
      });
    });
    });
});

module.exports = router;
