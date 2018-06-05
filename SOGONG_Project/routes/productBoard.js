var express = require('express');
var router = express.Router();

var multer = require('multer');

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/productImg')
  },
  filename: function (req, file, cb) {
    cb(null, new Date().valueOf() + file.originalname);
  }
});
var upload = multer({storage : storage});

/*Database*/
var mysql = require('mysql');

var pool = mysql.createPool({
  connectionLimit: 5,
  host: 'localhost',
  user: 'root',
  database: 'project3',
  password: '12345'
});

/***********************************PRODUCT LIST****************************************/
//FOOD LIST
router.get('/foodList/:page', function(req, res, next){
  var page = req.params.page;
  var session = req.session;
  var id=session.user_id;

  pool.getConnection(function(err, connection){
    //Use the connection
    var sqlForSelectList = "SELECT idx, main_img, prd_name, price FROM product_food";
    connection.query(sqlForSelectList, function(err, rows){
      if(err) console.error("err : " + err);
      console.log("rows : " + JSON.stringify(rows));
      res.render('list_product', {web_name : 'Pit-A-Pet', title : 'FOOD', id: session.user_id, web_product : 'foodList', product : "product_food", rows: rows, page:page, len:Object.keys(rows).length-1, pageNum: 6, pass: true} );
      connection.release();
    });
  });
});

//CLOTHES LIST
router.get('/clothesList/:page', function(req, res, next){
  var page = req.params.page;
  var session = req.session;
  var id=session.user_id;

  pool.getConnection(function(err, connection){
    //Use the connection
    var sqlForSelectList = "SELECT idx, main_img, prd_name, price FROM product_clothes";
    connection.query(sqlForSelectList, function(err, rows){
      if(err) console.error("err : " + err);
      console.log("rows : " + JSON.stringify(rows));
      res.render('list_product', {web_name : 'Pit-A-Pet', title : 'CLOTHES', id: session.user_id, web_product : 'clothesList', product : "product_clothes", rows: rows, page:page, len:Object.keys(rows).length-1, pageNum: 6, pass: true} );
      connection.release();
    });
  });
});

//TOY LIST
router.get('/toyList/:page', function(req, res, next){
  var page = req.params.page;
  var session = req.session;
  var id=session.user_id;

  pool.getConnection(function(err, connection){
    //Use the connection
    var sqlForSelectList = "SELECT idx, main_img, prd_name, price FROM product_toy";
    connection.query(sqlForSelectList, function(err, rows){
      if(err) console.error("err : " + err);
      console.log("rows : " + JSON.stringify(rows));
      res.render('list_product', {web_name : 'Pit-A-Pet', title : 'TOY', id: session.user_id, web_product : 'toyList', product : "product_toy", rows: rows, page:page, len:Object.keys(rows).length-1, pageNum: 6, pass: true} );
      connection.release();
    });
  });
});

//HEALTH CARE LIST
router.get('/healthCareList/:page', function(req, res, next){
  var page = req.params.page;
  var session = req.session;
  var id=session.user_id;

  pool.getConnection(function(err, connection){
    //Use the connection
    var sqlForSelectList = "SELECT idx, main_img, prd_name, price FROM product_health";
    connection.query(sqlForSelectList, function(err, rows){
      if(err) console.error("err : " + err);
      console.log("rows : " + JSON.stringify(rows));
      res.render('list_product', {web_name : 'Pit-A-Pet', title : 'HEALTH CARE',id: session.user_id,  web_product : 'healthCareList', product : "product_health", rows: rows, page:page, len:Object.keys(rows).length-1, pageNum: 6, pass: true} );
      connection.release();
    });
  });
});
/******************************************************************************************************************/

//상품등록 화면 표시 GET
router.get('/write_product', function(req, res, next) {
  var session = req.session;
  var id=session.user_id;
  res.render('write_product', {web_name : 'Pit-A-Pet', id: session.user_id,  title : 'WRITE PRODUCT'});
});

//상품등록 로직 처리 POST
router.post('/write_product', upload.single('main_img'), function(req,res,next){
  var category = req.body.category;
  var idx = req.body.idx;
  var main_img = "/uploads/productImg/"+req.file.filename;
  var prd_name = req.body.prd_name;
  var prd_des = req.body.prd_des;
  var price = req.body.price;
  var tear = 0;
  var joint = 0;
  var hair = 0;
  var diet = 0;
  var td_special = 0;
  var price_event = 0;


  if(req.body.tear){
    tear = 1;
  }
  if(req.body.joint){
    joint = 1;
  }
  if(req.body.hair){
    hair = 1;
  }
  if(req.body.diet){
    diet = 1;
  }
  if(req.body.td_special!=0) {
    td_special = req.body.td_special;
  }
  if(req.body.event!=0) {
    price_event = req.body.event;
  }

  var datas = [idx, category, main_img, prd_name, prd_des, price, td_special, price_event, tear, joint, hair, diet];
  pool.getConnection(function(err, connection) {
    //Use the connection
    if(category==0) { //FOOD Category
      var sqlForInsert = "insert into product_food(idx, category, main_img, prd_name, prd_des, price, td_special, event, tear, joint, hair, diet) values(?,?,?,?,?,?,?,?,?,?,?,?)";
      connection.query(sqlForInsert, datas, function(err, rows){
        if(err) console.error("err : " + err);
        console.log("rows : " + JSON.stringify(rows));

        res.redirect('/productBoard/foodList/1');
        connection.release();

        //Don't use the connection here, it has been returned to the pool.
      });
    }
    else if(category==1) { //CLOTHES Category
      var sqlForInsert = "insert into product_clothes(idx, category, main_img, prd_name, prd_des, price, td_special, event, tear, joint, hair, diet) values(?,?,?,?,?,?,?,?,?,?,?,?)";
      connection.query(sqlForInsert, datas, function(err, rows){
        if(err) console.error("err : " + err);
        console.log("rows : " + JSON.stringify(rows));

        res.redirect('/productBoard/clothesList/1');
        connection.release();

        //Don't use the connection here, it has been returned to the pool.
      });
    }
    else if(category==2) { //TOY Category
      var sqlForInsert = "insert into product_toy(idx, category, main_img, prd_name, prd_des, price, td_special, event, tear, joint, hair, diet) values(?,?,?,?,?,?,?,?,?,?,?,?)";
      connection.query(sqlForInsert, datas, function(err, rows){
        if(err) console.error("err : " + err);
        console.log("rows : " + JSON.stringify(rows));

        res.redirect('/productBoard/toyList/1');
        connection.release();

        //Don't use the connection here, it has been returned to the pool.
      });
    }
    else if(category==3) { //HeALTH CARE Category
      var sqlForInsert = "insert into product_health(idx, category, main_img, prd_name, prd_des, price, td_special, event, tear, joint, hair, diet) values(?,?,?,?,?,?,?,?,?,?,?,?)";
      connection.query(sqlForInsert, datas, function(err, rows){
        if(err) console.error("err : " + err);
        console.log("rows : " + JSON.stringify(rows));

        res.redirect('/productBoard/healthCareList/1');
        connection.release();

        //Don't use the connection here, it has been returned to the pool.
      });
    }

  });
});

/***********************************************상품 조회************************************************/
//FOOD 상품 조회
router.get('/product_food/:idx', function(req, res, next){
  var session = req.session;
  var id=session.user_id;
  var idx = req.params.idx;
  var web_product = req.params.web_product;

  pool.getConnection(function(err, connection) {
    var sql = "select idx, main_img, prd_name, prd_des, price from product_food where idx=?";

    connection.query(sql, [idx], function(err, rows){
      if(err) console.error(err);

      var hit = req.body.hit;
      var updateSql = "update product_food set hit = hit + 1 where idx=?";

      connection.query(updateSql, [idx, hit], function(err, row){
        console.log("1개 상품 조회 결과 확인 : ", row);
        res.render('read_product', {web_name : 'Pit-A-Pet', id: session.user_id, title : "ENJOY FOOD SHOPPING", row:rows[0]});
      });
    });
  });
});

//CLOTHES 상품 조회
router.get('/product_clothes/:idx', function(req, res, next){
  var session = req.session;
  var id=session.user_id;
  var idx = req.params.idx;
  var web_product = req.params.web_product;

  pool.getConnection(function(err, connection) {
    var sql = "select idx, main_img, prd_name, prd_des, price from product_clothes where idx=?";

    connection.query(sql, [idx], function(err, rows){
      if(err) console.error(err);

      var hit = req.body.hit;
      var updateSql = "update product_clothes set hit = hit + 1 where idx=?";

      connection.query(updateSql, [idx, hit], function(err, row){
        console.log("1개 상품 조회 결과 확인 : ", row);
        res.render('read_product', {web_name : 'Pit-A-Pet', id: session.user_id, title : "ENJOY CLOTHES SHOPPING", row:rows[0]});
      });
    });
  });
});

//TOY 상품 조회
router.get('/product_toy/:idx', function(req, res, next){
  var session = req.session;
  var id=session.user_id;
  var idx = req.params.idx;
  var web_product = req.params.web_product;

  pool.getConnection(function(err, connection) {
    var sql = "select idx, main_img, prd_name, prd_des, price from product_toy where idx=?";

    connection.query(sql, [idx], function(err, rows){
      if(err) console.error(err);

      var hit = req.body.hit;
      var updateSql = "update product_toy set hit = hit + 1 where idx=?";

      connection.query(updateSql, [idx, hit], function(err, row){
        console.log("1개 상품 조회 결과 확인 : ", row);
        res.render('read_product', {web_name : 'Pit-A-Pet', id: session.user_id, title : "ENJOY TOY SHOPPING", row:rows[0]});
      });
    });
  });
});

//HEALTH CARE 상품 조회
router.get('/product_health/:idx', function(req, res, next){
  var session = req.session;
  var id=session.user_id;
  var idx = req.params.idx;
  var web_product = req.params.web_product;

  pool.getConnection(function(err, connection) {
    var sql = "select idx, main_img, prd_name, prd_des, price from product_health where idx=?";

    connection.query(sql, [idx], function(err, rows){
      if(err) console.error(err);

      var hit = req.body.hit;
      var updateSql = "update product_health set hit = hit + 1 where idx=?";

      connection.query(updateSql, [idx, hit], function(err, row){
        console.log("1개 상품 조회 결과 확인 : ", row);
        res.render('read_product', {web_name : 'Pit-A-Pet', id: session.user_id, title : "ENJOY HEALTH CARE SHOPPING", row:rows[0]});
      });
    });
  });
});
/*****************************************************************************************************/
//상품 삭제
router.get('/delete/:idx', function(req, res){
  var idx = req.params.idx;
  pool.getConnection(function(err, connection) {
    var sql = "delete from product_food where idx=?";
    connection.query(sql, [idx], function(err, result){
      console.log(result);
      if(err) console.error("글 삭제 중 에러 발생 err : ", err);
      res.redirect('/productBoard/list/1');
      connection.release();
    });
  });
});

//상품 수정 화면 가져오기
router.get('/update_product', function(req, res, next){
  var idx = req.query.idx;

  pool.getConnection(function(err, connection){
    if(err) console.error("커넥션 객체 얻어오기 에러 : ", err);

    var sql = "select idx, main_img, prd_name, prd_des, price from product_food where idx=?";
    connection.query(sql, [idx], function(err, rows){
      if(err) console.error(err);
      console.log("수정 할 상품 호출 : ", rows);
      res.render('update_product', {web_name : 'Pit-A-Pet', title : 'UPDATE PRODUCT', row:rows[0]});
      connection.release();
    });
  });
});

//상품 수정하기
router.post('/update_product', upload.single('main_img'), function(req, res, next){
  var idx = req.body.idx;
  var main_img = "/uploads/productImg/"+req.file.filename;
  var prd_name = req.body.prd_name;
  var prd_des = req.body.prd_des;
  var price = req.body.price;
  var datas = [main_img, prd_name, prd_des, price, idx];

  pool.getConnection(function(err, connection) {
    var sql = "update product_food set main_img=?, prd_name=?, prd_des=?, price=? where idx=?";
    connection.query(sql, datas, function(err, result){
      console.log(result);
      if(err) console.error("글 수정 중 에러 발생 err : ", err);

      res.redirect('/productBoard/product/'+idx);
      connection.release();
    });
  });
});

module.exports = router;
