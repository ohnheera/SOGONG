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

router.get('/', function(req, res, next){
  res.redirect('clothesList/1')
});


/***********************************PRODUCT LIST****************************************/
//FOOD LIST
router.get('/foodList/:page', function(req, res, next){
  var page = req.params.page;
  var session = req.session;
  var id=session.user_id;
  var order = req.query.order;
  if(order) {
    console.log("@@@@@@@@@@@@@@@@@@@@@@@ : ", order);
  }
  else {
    order=0;
  }
  pool.getConnection(function(err, connection){
    //Use the connection
    if(order==0) { //신상순
      var sqlForSelectList = "SELECT idx, main_img, prd_name, price, td_special, event FROM product_food order by idx DESC";
    }
    else if(order==1) { //인기순
      var sqlForSelectList = "SELECT idx, main_img, prd_name, price, td_special, event FROM product_food order by sell_rate DESC";
    }
    else if(order==2) { //낮은가격부터
      var sqlForSelectList = "SELECT idx, main_img, prd_name, price, td_special, event FROM product_food order by price ASC";
    }
    else if(order==3) { //높은가격부터
      var sqlForSelectList = "SELECT idx, main_img, prd_name, price, td_special, event FROM product_food order by price DESC";
    }

    connection.query(sqlForSelectList, function(err, rows){
      if(err) console.error("err : " + err);
      console.log("rows : " + JSON.stringify(rows));
      res.render('list_product', {web_name : 'PITAPET', title : 'FOOD', id: session.user_id, order:order, category:0, web_product : 'foodList', product : "product_food", rows: rows, page:page, len:Object.keys(rows).length-1, pageNum: 6, pass: true} );
      connection.release();
    });
  });
});

//CLOTHES LIST
router.get('/clothesList/:page', function(req, res, next){
  var page = req.params.page;
  var session = req.session;
  var id=session.user_id;
  var order = req.query.order;
  if(order) {
    console.log("@@@@@@@@@@@@@@@@@@@@@@@ : ", order);
  }
  else {
    order=0;
  }
  pool.getConnection(function(err, connection){
    //Use the connection
    if(order==0) { //신상순
      var sqlForSelectList = "SELECT idx, main_img, prd_name, price, td_special, event FROM product_clothes order by idx DESC";
    }
    else if(order==1) { //인기순
      var sqlForSelectList = "SELECT idx, main_img, prd_name, price, td_special, event FROM product_clothes order by sell_rate DESC";
    }
    else if(order==2) { //낮은가격부터
      var sqlForSelectList = "SELECT idx, main_img, prd_name, price, td_special, event FROM product_clothes order by price ASC";
    }
    else if(order==3) { //높은가격부터
      var sqlForSelectList = "SELECT idx, main_img, prd_name, price, td_special, event FROM product_clothes order by price DESC";
    }
    connection.query(sqlForSelectList, function(err, rows){
      if(err) console.error("err : " + err);
      console.log("rows : " + JSON.stringify(rows));
      res.render('list_product', {web_name : 'PITAPET', title : 'CLOTHES', id: session.user_id, category:1, web_product : 'clothesList', product : "product_clothes", rows: rows, page:page, len:Object.keys(rows).length-1, pageNum: 6, pass: true} );
      connection.release();
    });
  });
});

//TOY LIST
router.get('/toyList/:page', function(req, res, next){
  var page = req.params.page;
  var session = req.session;
  var id=session.user_id;
  var order = req.query.order;
  if(order) {
    console.log("@@@@@@@@@@@@@@@@@@@@@@@ : ", order);
  }
  else {
    order=0;
  }
  pool.getConnection(function(err, connection){
    //Use the connection
    if(order==0) { //신상순
      var sqlForSelectList = "SELECT idx, main_img, prd_name, price, td_special, event FROM product_toy order by idx DESC";
    }
    else if(order==1) { //인기순
      var sqlForSelectList = "SELECT idx, main_img, prd_name, price, td_special, event FROM product_toy order by sell_rate DESC";
    }
    else if(order==2) { //낮은가격부터
      var sqlForSelectList = "SELECT idx, main_img, prd_name, price, td_special, event FROM product_toy order by price ASC";
    }
    else if(order==3) { //높은가격부터
      var sqlForSelectList = "SELECT idx, main_img, prd_name, price, td_special, event FROM product_toy order by price DESC";
    }
    connection.query(sqlForSelectList, function(err, rows){
      if(err) console.error("err : " + err);
      console.log("rows : " + JSON.stringify(rows));
      res.render('list_product', {web_name : 'PITAPET', title : 'TOY', id: session.user_id, category:2, web_product : 'toyList', product : "product_toy", rows: rows, page:page, len:Object.keys(rows).length-1, pageNum: 6, pass: true} );
      connection.release();
    });
  });
});

//HEALTH CARE LIST
router.get('/healthCareList/:page', function(req, res, next){
  var page = req.params.page;
  var session = req.session;
  var id=session.user_id;
  var order = req.query.order;
  if(order) {
    console.log("@@@@@@@@@@@@@@@@@@@@@@@ : ", order);
  }
  else {
    order=0;
  }
  pool.getConnection(function(err, connection){
    //Use the connection
    if(order==0) { //신상순
      var sqlForSelectList = "SELECT idx, main_img, prd_name, price, td_special, event FROM product_health order by idx DESC";
    }
    else if(order==1) { //인기순
      var sqlForSelectList = "SELECT idx, main_img, prd_name, price, td_special, event FROM product_health order by sell_rate DESC";
    }
    else if(order==2) { //낮은가격부터
      var sqlForSelectList = "SELECT idx, main_img, prd_name, price, td_special, event FROM product_health order by price ASC";
    }
    else if(order==3) { //높은가격부터
      var sqlForSelectList = "SELECT idx, main_img, prd_name, price, td_special, event FROM product_health order by price DESC";
    }
    connection.query(sqlForSelectList, function(err, rows){
      if(err) console.error("err : " + err);
      console.log("rows : " + JSON.stringify(rows));
      res.render('list_product', {web_name : 'PITAPET', title : 'HEALTH CARE',id: session.user_id,  category:3, web_product : 'healthCareList', product : "product_health", rows: rows, page:page, len:Object.keys(rows).length-1, pageNum: 6, pass: true} );
      connection.release();
    });
  });
});
/******************************************************************************************************************/

//상품등록 화면 표시 GET
router.get('/write_product', function(req, res, next) {
  var session = req.session;
  var id=session.user_id;
  res.render('write_product', {web_name : 'PITAPET', id: session.user_id,  title : 'WRITE PRODUCT'});
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
    var sql = "select idx, category, main_img, prd_name, prd_des, price, tear, joint, hair, diet from product_food where idx=?";

    connection.query(sql, [idx], function(err, rows){
      if(err) console.error(err);

      var hit = req.body.hit;
      var updateSql = "update product_food set hit = hit + 1 where idx=?";

      connection.query(updateSql, [idx, hit], function(err, row){
        console.log("1개 상품 조회 결과 확인 : ", row);
        var reviewSql = "select creator_id, title, content, star from review_board where category=0 && prd_id=?";
        connection.query(reviewSql, [idx], function(err, results){
          console.log("rows : " + JSON.stringify(results));
          res.render('read_product', {web_name : 'PITAPET', id: session.user_id, title : "ENJOY FOOD SHOPPING",len:Object.keys(results).length, reviews:results, row:rows[0]});
        });
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
    var sql = "select idx, category, main_img, prd_name, prd_des, price from product_clothes where idx=?";

    connection.query(sql, [idx], function(err, rows){
      if(err) console.error(err);

      var hit = req.body.hit;
      var updateSql = "update product_clothes set hit = hit + 1 where idx=?";
      connection.query(updateSql, [idx, hit], function(err, row){
        console.log("1개 상품 조회 결과 확인 : ", row);

        var reviewSql = "select creator_id, title, content, star from review_board where category=1 && prd_id=?";
        connection.query(reviewSql, [idx], function(err, results){
            console.log("1개 리뷰 조회 결과 확인 : ", results);
          res.render('read_product', {web_name : 'PITAPET', id: session.user_id, title : "ENJOY CLOTHES SHOPPING", len:Object.keys(results).length, reviews:results, row:rows[0]});
        });
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
    var sql = "select idx, category, main_img, prd_name, prd_des, price from product_toy where idx=?";

    connection.query(sql, [idx], function(err, rows){
      if(err) console.error(err);

      var hit = req.body.hit;
      var updateSql = "update product_toy set hit = hit + 1 where idx=?";

      connection.query(updateSql, [idx, hit], function(err, row){
        console.log("1개 상품 조회 결과 확인 : ", row);
        var reviewSql = "select creator_id, title, content, star from review_board where category=2 && prd_id=?";
        connection.query(reviewSql, [idx], function(err, results){
          console.log("1개 리뷰 조회 결과 확인 : ", results);
          res.render('read_product', {web_name : 'PITAPET', id: session.user_id, title : "ENJOY TOY SHOPPING", len:Object.keys(results).length, reviews:results[0], row:rows[0]});
        });
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
    var sql = "select idx, category, main_img, prd_name, prd_des, price from product_health where idx=?";

    connection.query(sql, [idx], function(err, rows){
      if(err) console.error(err);

      var hit = req.body.hit;
      var updateSql = "update product_health set hit = hit + 1 where idx=?";

      connection.query(updateSql, [idx, hit], function(err, row){
        console.log("1개 상품 조회 결과 확인 : ", row);
        var reviewSql = "select creator_id, title, content, star from review_board where category=3 && prd_id=?";

        connection.query(reviewSql, [idx], function(err, results){
          console.log("1개 리뷰 조회 결과 확인 : ", results);
          res.render('read_product', {web_name : 'PITAPET', id: session.user_id, title : "ENJOY HEALTH CARE SHOPPING", len:Object.keys(results).length, reviews:results, row:rows[0]});
        });
      });
    });
  });
});
/*****************************************************************************************************/
//상품 삭제
router.get('/delete_product/', function(req, res){
  var idx = req.query.idx;
  var category = req.query.category;

  pool.getConnection(function(err, connection) {
    if(category==0) {
      var sql = "delete from product_food where idx=?";
    }
    else if(category==1) {
      var sql = "delete from product_clothes where idx=?";
    }
    else if(category==2) {
      var sql = "delete from product_toy where idx=?";
    }
    else if(category==3) {
      var sql = "delete from product_health where idx=?";
    }

    connection.query(sql, [idx], function(err, result){
      console.log(result);
      if(err) console.error("글 삭제 중 에러 발생 err : ", err);
      if(category==0) {
        res.redirect('/productBoard/foodList/1');
      }
      else if(category==1) {
        res.redirect('/productBoard/clothesList/1');
      }
      else if(category==2) {
        res.redirect('/productBoard/toyList/1');
      }
      else if(category==3) {
        res.redirect('/productBoard/healthCareList/1');
      }
      connection.release();
    });
  });
});

//카트 추가
router.get('/addProduct', function(req, res){
  var session = req.session;
  var id=session.user_id;
  var idx = req.query.idx;
  var category=req.query.category;
  var num_prd=req.query.num_prd;

  pool.getConnection(function(err, connection) {
    //insert into cart(idx, category, main_img, prd_name, prd_des, price, td_special, event, tear, joint, hair, diet) values(?,?,?,?,?,?,?,?,?,?,?,?)
    if(category==0) { //FOOD
      var selectSql = "select category, main_img, prd_name, prd_des, price, sell_rate, event from product_food where idx=?";
    }
    else if(category==1) { //CLOTHES
      var selectSql = "select category, main_img, prd_name, prd_des, price, sell_rate, event from product_clothes where idx=?";
    }
    else if(category==2) { //TOY
      var selectSql = "select category, main_img, prd_name, prd_des, price, sell_rate, event from product_toy where idx=?";
    }
    else if(category==3) { //HEALTH CARE
      var selectSql = "select category, main_img, prd_name, prd_des, price, sell_rate, event from product_health where idx=?";
    }
    connection.query(selectSql, [idx], function(err, row){
      if(err) console.error("상품 선택 에러 발생 err : ", err);
      //id, product_num, price, amount, name, pic, sell_rate, event
      var datas = [id, row[0].category, row[0].price, num_prd, row[0].prd_name, row[0].main_img, row[0].sell_rate, row[0].event];
      var insertSql = "insert into cart(id, product_num, price, amount, name, pic, sell_rate, event) values(?,?,?,?,?,?,?,?)";
      connection.query(insertSql, datas, function(err, result){
        if(err) console.error("err : " + err);
        console.log("rows : " + JSON.stringify(result));

        if(category==0) {
          res.redirect('/productBoard/product_food/'+idx);
        }
        else if(category==1) {
          res.redirect('/productBoard/product_clothes/'+idx);
        }
        else if(category==2) {
          res.redirect('/productBoard/product_toy/'+idx);
        }
        else if(category==3) {
          res.redirect('/productBoard/product_health/'+idx);
        }
        connection.release();
      });
    });
  });
});

//상품 리뷰 화면 가져오기
router.get('/write_review', function(req,res, next){
  var session = req.session;
  var id=session.user_id;
  var idx = req.query.idx;
  var category=req.query.category;
  res.render('write_review', {web_name : 'PITAPET', id: session.user_id,  prd_id:idx, prd_ca:category, title : 'REVIEW'});
});

//상품 리뷰 데이터 처리
router.post('/write_review', upload.single('image'), function(req, res, next){
  var prd_idx = req.body.prd_id;
  var category= req.body.category;

  var creator_id = req.body.creator_id;
  var title = req.body.title;
  var content = req.body.content;
  var passwd = req.body.passwd;
  var star = req.body.star;

  var datas = [category, prd_idx, creator_id, title, content, passwd, star];

  pool.getConnection(function (err, connection){
    //Use the connection
    var sqlForInsertBoard = "insert into review_board(category, prd_id, creator_id, title, content, passwd, star) values(?,?,?,?,?,?,?)";
    connection.query(sqlForInsertBoard, datas, function(err, rows){
      //if(err) console.error("err:" + err);
      if(err) console.error("ERROR: ", err);
      //console.log("rows : " + JSON.stringify(rows));

      if(category==0) {
        res.redirect('/productBoard/product_food/'+prd_idx);
      }
      else if(category==1) {
        res.redirect('/productBoard/product_clothes/'+prd_idx);
      }
      else if(category==2) {
        res.redirect('/productBoard/product_toey/'+prd_idx);
      }
      else if(category==3) {
        res.redirect('/productBoard/product_health/'+prd_idx);
      }
      connection.release();

      //Don't use the connection here, it has been returned to the pool.
    });
  });
});
/**********************************************************************************************************/
//상품 수정 화면 가져오기
router.get('/update_product', function(req, res, next){
  var idx = req.query.idx;
  var category = req.query.category;
  var session = req.session;
  var id=session.user_id;

  pool.getConnection(function(err, connection){
    if(err) console.error("커넥션 객체 얻어오기 에러 : ", err);

    if(category==0) {
      var sql = "select idx, category, main_img, prd_name, prd_des, price, td_special, event, tear, joint, hair, diet from product_food where idx=?";
    }
    else if(category==1) {
      var sql = "select idx, category, main_img, prd_name, prd_des, price, td_special, event, tear, joint, hair, diet from product_clothes where idx=?";
    }
    else if(category==2) {
      var sql = "select idx, category, main_img, prd_name, prd_des, price, td_special, event, tear, joint, hair, diet from product_toy where idx=?";
    }
    else if(category==3) {
      var sql = "select idx, category, main_img, prd_name, prd_des, price, td_special, event, tear, joint, hair, diet from product_health where idx=?";
    }

    connection.query(sql, [idx], function(err, rows){
      if(err) console.error(err);
      console.log("수정 할 상품 호출 : ", rows);

      res.render('update_product', {web_name : 'PITAPET', id: session.user_id, title : 'UPDATE PRODUCT', row:rows[0]});
      connection.release();
    });
  });
});

//상품 수정하기
router.post('/update_product', upload.single('main_img'), function(req, res, next){
  var category= req.body.category;
  var idx = req.body.idx;
  var main_img = "/uploads/productImg/"+req.file.filename;
  var prd_name = req.body.prd_name;
  var prd_des = req.body.prd_des;
  var price = req.body.price;
  var tear = 0;
  var joint = 0;
  var hair = 0;
  var diet = 0;
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
  var td_special = req.body.td_special;
  var price_event = req.body.price_event;
  var datas = [main_img, prd_name, prd_des, price, td_special, price_event, tear, joint, hair, diet, idx];

  pool.getConnection(function(err, connection) {
    if(category==0) {
      var sql = "update product_food set main_img=?, prd_name=?, prd_des=?, price=?, td_special=?, event=?, tear=?, joint=?, hair=?, diet=? where idx=?";
    }
    else if(category==1) {
      var sql = "update product_clothes set main_img=?, prd_name=?, prd_des=?, price=?, td_special=?, event=?, tear=?, joint=?, hair=?, diet=? where idx=?";
    }
    else if(category==2) {
      var sql = "update product_toy set main_img=?, prd_name=?, prd_des=?, price=?, td_special=?, event=?, tear=?, joint=?, hair=?, diet=? where idx=?";
    }
    else if(category==3) {
      var sql = "update product_health set main_img=?, prd_name=?, prd_des=?, price=?, td_special=?, event=?, tear=?, joint=?, hair=?, diet=? where idx=?";
    }
    connection.query(sql, datas, function(err, result){
      console.log(result);
      if(err) console.error("글 수정 중 에러 발생 err : ", err);

      if(category==0) {
        res.redirect('/productBoard/foodList/1');
      }
      else if(category==1) {
        res.redirect('/productBoard/clothesList/1');
      }
      else if(category==2) {
        res.redirect('/productBoard/toyList/1');
      }
      else if(category==3) {
        res.redirect('/productBoard/healthCareList/1');
      }

      connection.release();
    });
  });
});

module.exports = router;
