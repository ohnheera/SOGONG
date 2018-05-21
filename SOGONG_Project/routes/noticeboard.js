var express = require('express');
var router = express.Router();
var multer = require('multer');

router.use(express.static('public'));

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/images/')
    },
    filename: function (req, file, cb) {
        //req.body is empty...
        cb(null, file.originalname);
    }
})

var upload = multer({ storage: storage })

//MySQL 로드
var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit: 5,
  host: 'localhost',
  user: 'root',
  database: 'test',
  password: '12345'
});

/* GET users listing. */
router.get('/', function(req, res, next){
  //그냥 board/로 접속할 경우 전체 목록 표시로 리다이렉팅
  res.redirect('/noticeboard/list_notice/1');
});

router.get('/list_notice/:page', function(req, res, next){
  var page=req.params.page;

  pool.getConnection(function (err, connection){
    //Use the connection
    var sqlForSelectList = "SELECT * FROM noticeboard";
    connection.query(sqlForSelectList, function(err, rows){
      //if(err) console.error("err : "+ err);
      if(err) res.send(err);
      //console.log("rows: " + JSON.stringify(rows));

      res.render('list_notice', { title: '공지사항', rows: rows, page: page, leng: Object.keys(rows).length-1, page_num: 5, pass: true});
      connection.release();

      //Don't use the connection here, it has been returned to the pool.
    });
  });
});

//글쓰기 화면 표시 GET
router.get('/write_notice', function(req, res, next){
  res.render('write_notice', {title : "글쓰기 "});
});

//글쓰기 로직 처리 POST
router.post('/write_notice', upload.single('image'), function(req, res, next){

  var creator_id = req.body.creator_id;
  var title = req.body.title;
  var content = req.body.content;
  var passwd = req.body.passwd;
  if (!req.file) {
    var image=null;
    //return res.send('Please upload a file');
  }
  else {
    var image=req.file.filename;
  }
  var datas = [creator_id, title, content, image, passwd];

  pool.getConnection(function (err, connection){
    //Use the connection
    var sqlForInsertBoard = "insert into noticeboard(creator_id, title, content, image, passwd) values(?, ?, ?, ?, ?)";
    connection.query(sqlForInsertBoard, datas, function(err, rows){
      //if(err) console.error("err:" + err);
      if(err) res.send(err);
      //console.log("rows : " + JSON.stringify(rows));

      res.redirect('/noticeboard');
      connection.release();

      //Don't use the connection here, it has been returned to the pool.
    });
  });
});

//글쓰기 로직 처리 GET
router.get('/read_notice/:idx', function(req, res, next){
  var idx = req.params.idx;

  pool.getConnection(function(err, connection){
    var sql = "select idx, creator_id, title, content, image, hit from noticeboard where idx=?";
    connection.query(sql, [idx], function(err, rows){
      //if(err) console.error(err);
      if(err) res.send(err);
      //console.log("1개 글 조회 결과 확인 : ", rows);
      var hit = req.body.hit;
      var sql2="update noticeboard set hit = hit + 1 where idx=?";
      connection.query(sql2, [idx, hit], function(err, row){
        console.log("1개 글 조회 결과 확인 : ", row);
        res.render('read_notice', {title:"글 조회", row:rows[0]});
      });
    });
  });
});

//글수정 화면 표시 GET
router.get('/update_notice', function(req, res, next){
  var idx = req.query.idx;

  pool.getConnection(function(err, connection){
    //if(err) console.error("커넥션 객체 얻어오기 에러: ", err);
    if(err) res.send(err);

    var sql = "select idx, creator_id, title, content, image, hit from noticeboard where idx=?";
    connection.query(sql, [idx], function(err, rows){
      //if(err) console.error(err);
      if(err) res.send(err);
      //console.log("update에서 1개 글 조회 결과 확인 : ", rows);
      res.render('update_notice', {title:"글 수정", row:rows[0]});
    });
  });
});

//글수정 로직 처리 POST
router.post('/update_notice', function(req, res, next){
  var idx=req.body.idx;
  var creator_id=req.body.creator_id;
  var title=req.body.title;
  var content=req.body.content;
  var passwd=req.body.passwd;
  var image=req.body.image;
  var datas=[creator_id, title, content, passwd];

  pool.getConnection(function(err, connection){
    var sql="update noticeboard set creator_id=?, title=?, content=?, image=? where idx=? and passwd=?";
    connection.query(sql, [creator_id, title, content, image, idx, passwd], function(err, result){
      //console.log(result);
      //if(err) console.error("글 수정 중 에러 발생 err:", err);
      if(err) res.send(err);
      if(result.affectedRows == 0){
        res.send("<script>alert('패스워드가 일치하지 않거나, 잘못된 요청으로 인해 값이 변경되지 않았습니다.');history.back();</script>");
      }
      else{
        res.redirect('/noticeboard/read_notice/'+idx);
        //res.redirect('/board/');
      }
      connection.release();
    });
  });
});

router.get('/delete_notice', function(req, res, next){
  var idx = req.query.idx;

  pool.getConnection(function(err, connection){
    //if(err) console.error("커넥션 객체 얻어오기 에러 : ", err);
    if(err) res.send(err);
    var sql = "select idx, creator_id, title, content, image, hit from noticeboard where idx=?";
    connection.query(sql, [idx], function(err, rows){
      //if(err) console.error(err);
      if(err) res.send(arr);
      //console.log("delete에서 1개 글 조회 결과 확인 : ", rows);
      res.render('delete_notice', {title:"글 삭제 시 비밀번호를 입력하세요. ", row:rows[0]});
    });
  });
});

router.post('/delete_notice', function (req, res, next) {
  var passwd = req.body.passwd;
  var idx = req.body.idx;
  var datas = [idx, passwd];
  var sql = "delete from noticeboard where idx=? and passwd=?";

    pool.getConnection(function(err, connection) {
        connection.query(sql, datas, function (err, rows) {
         //if (err) console.error('err', err);
         if(err) res.send(err);
         //console.log(idx + ", " + passwd);
         //console.log("rows : " + JSON.stringify(rows));
         res.redirect('/noticeboard');
         connection.release();
       });
     });
 });

module.exports = router;
