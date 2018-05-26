var express = require('express');
var router = express.Router();

var multer = require('multer');

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/images')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
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

//Get Product List
router.get('/', function(req, res, next) {
  res.redirect('productBoard/list/1');
});

router.get('/list/:page', function(req, res, next){
  pool.getConnection(function(err, connection){
    //Use the connection
    var sqlForSelectList = "SELECT idx, main_img, prd_name, price FROM product";
    connection.query(sqlForSelectList, function(err, rows){
      if(err) console.error("err : " + err);
      console.log("rows : " + JSON.stringify(rows));
      res.render('list_product', {web_name : 'MY PET', title : 'PRODUCT LIST', rows: rows} );
      connection.release();
    });
  });
});

//상품 조회
router.get('/product/:idx', function(req, res, next){
  var idx = req.params.idx;
  pool.getConnection(function(err, connection) {
    var sql = "select idx, main_img, prd_name, price from product where idx=?";

    connection.query(sql,[idx], function(err, row){
      if(err) console.error(err);

      console.log("1개 상품 조회 결과 확인 : ", row);
      res.render('product', {title : "상품 조회", row:row[0]});

      connection.release();
    });
  });
});

//상품 삭제
router.get('/delete/:idx', function(req, res){
  var idx = req.params.idx;
  pool.getConnection(function(err, connection) {
    var sql = "delete from product where idx=?";
    connection.query(sql, [idx], function(err, result){
      console.log(result);
      if(err) console.error("글 삭제 중 에러 발생 err : ", err);
      res.redirect('/productBoard/list/1');
      connection.release();
    });
  });
});

//상품 수정 화면 가져오기
router.get('/update', function(req, res, next){
  var idx = req.query.idx;

  pool.getConnection(function(err, connection){
    if(err) console.error("커넥션 객체 얻어오기 에러 : ", err);

    var sql = "select idx, main_img, prd_name, price from product where idx=?";
    connection.query(sql, [idx], function(err, rows){
      if(err) console.error(err);
      console.log("수정 할 상품 호출 : ", rows);
      res.render('update', {title:"상품 수정", row:rows[0]});
      connection.release();
    });
  });
});

//상품 수정하기
router.post('/update', function(req, res, next){
  var idx = req.body.idx;
  var main_img = "/images/"+req.file.filename;
  var prd_name = req.body.prd_name;
  var price = req.body.price;
  var datas = [main_img, prd_name, price];

  pool.getConnection(function(err, connection) {
    var sql = "update product set main_img=?, prd_name=?, price=? where idx=?";
    connection.query(sql, datas, function(err, result){
      console.log(result);
      if(err) console.error("글 수정 중 에러 발생 err : ", err);

      res.redirect('/productBoard/product/'+idx);
      connection.release();
    });
  });
});

//상품 등록 화면 표시
router.get('/write', function(req, res, next) {
  res.render('write', {title : "상품 등록"});
});

//상품 등록 로직 처리
router.post('/write', upload.single('image'), function(req,res,next){
  var prd_name = req.body.prd_name;
  var price = req.body.price;
  var main_img = "/images/"+req.file.filename;
  var datas = [main_img, prd_name, price];

  pool.getConnection(function(err, connection) {
    //Use the connection
    var sqlForInsertBoard = "insert into product(main_img, prd_name, price) values(?,?,?)";
    connection.query(sqlForInsertBoard, datas, function(err, rows){
      if(err) console.error("err : " + err);
      console.log("rows : " + JSON.stringify(rows));

      res.redirect('/productBoard/list/1');
      connection.release();

      //Don't use the connection here, it has been returned to the pool.
    });
  });
});

module.exports = router;
