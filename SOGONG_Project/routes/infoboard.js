var express = require('express');
var router = express.Router();
var multer = require('multer');
var fs = require('fs');

router.use(express.static('public'));

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/infoboardimg/')
    },
    filename: function (req, file, cb) {
        //req.body is empty...
        //cb(null, file.originalname);
        cb(null, new Date().valueOf()+file.originalname);
    }
});

var upload = multer({ storage: storage });

//MySQL 로드
var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit: 5,
  host: 'localhost',
  user: 'root',
  database: 'project3',
  password: '12345'
});

/* GET users listing. */
router.get('/', function(req, res, next){
  //그냥 board/로 접속할 경우 전체 목록 표시로 리다이렉팅
  res.redirect('/infoboard/list_info/1');
});

router.get('/list_info/:page', function(req, res, next){
  var session = req.session;
  var id=session.user_id;
  var page=req.params.page;

  pool.getConnection(function (err, connection){
    //Use the connection
    var sqlForSelectList = "SELECT * FROM infoboard";
    connection.query(sqlForSelectList, function(err, rows){
      //if(err) console.error("err : "+ err);
      if(err) res.send(err);
      //console.log("rows: " + JSON.stringify(rows));

      res.render('list_info', { title: '정보게시판 ', rows: rows, id: session.user_id, page: page, leng: Object.keys(rows).length-1, page_num: 10, pass: true});
      connection.release();

      //Don't use the connection here, it has been returned to the pool.
    });
  });
});

//글쓰기 화면 표시 GET
router.get('/write_info', function(req, res, next){
  var session = req.session;
  var id=session.user_id;
  console.log("id :",id);
  res.render('write_info', {title : "글쓰기", id:session.user_id});
});

//글쓰기 로직 처리 POST
router.post('/write_info', upload.single('image'), function(req, res, next){

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
    var sqlForInsertBoard = "insert into infoboard(creator_id, title, content, image, passwd) values(?, ?, ?, ?, ?)";
    connection.query(sqlForInsertBoard, datas, function(err, rows){
      if(err) console.error("err:" + err);
      //if(err) res.send(err);
      //console.log("rows : " + JSON.stringify(rows));

      res.redirect('/infoboard/list_info/1');
      connection.release();

      //Don't use the connection here, it has been returned to the pool.
    });
  });
});

//글쓰기 로직 처리 GET
router.get('/read_info/:idx', function(req, res, next){
  var idx = req.params.idx;
  var session = req.session;
  var id=session.user_id;
  console.log("id :",id);

  pool.getConnection(function(err, connection){
    var sql = "select idx, creator_id, title, content, image, hit from infoboard where idx=?";
    connection.query(sql, [idx], function(err, rows){
      //if(err) console.error(err);
      if(err) res.send(err);

      var hit = req.body.hit;
      var sql2="update infoboard set hit = hit + 1 where idx=?";
      connection.query(sql2, [idx, hit], function(err, row){
        console.log("1개 글 조회 결과 확인 : ", row);
        res.render('read_info', {title:"글 조회 ", row:rows[0], id:session.user_id});
      });
    });
  });
});

//글수정 화면 표시 GET
router.get('/update_info', function(req, res, next){
  var idx = req.query.idx;
  var session = req.session;
  var id=session.user_id;
  console.log("id :",id);

  pool.getConnection(function(err, connection){
    //if(err) console.error("커넥션 객체 얻어오기 에러: ", err);
    if(err) res.send(err);

    var sql = "select idx, creator_id, title, content, image, hit from infoboard where idx=?";
    connection.query(sql, [idx], function(err, rows){
      //if(err) console.error(err);
      if(err) res.send(err);
      //console.log("update에서 1개 글 조회 결과 확인 : ", rows);
      res.render('update_info', {title:"글 수정", row:rows[0], id:session.user_id});
    });
  });
});

//글수정 로직 처리 POST
router.post('/update_info', upload.single('image'), function(req, res, next){
  var idx=req.body.idx;
  var creator_id=req.body.creator_id;
  var title=req.body.title;
  var content=req.body.content;
  var passwd=req.body.passwd;
  var image=req.body.image_previous;
  var image_new=req.body.image;

  var datas=[creator_id, title, content, passwd];
  console.log(image_new);
  if(req.file){
    var newFile = req.file.filename;
    console.log("new 파일: "+newFile);
  }
  else {
    var newFile = null;
  }
  console.log("기존 파일:" + image);
  if(newFile != null){
    console.log("새로운 파일 업로드, 기존 이미지 삭제");
    fs.exists('/uploads/infoboardimg/' + image, function(exists){ //기존 파일이 존재할 시 아래의 코드 실행
      if(exists == true){
        fs.unlink('/uploads/infoboardimg/' + image,function(err){ //기존 파일 삭제
          if(err) throw err;
          image = newFile;
          pool.getConnection(function(err,connection)
          {
            //데이터베이스의 파일명 등을 바꿔준다.
            //파일 삭제 -> 데이터베이스 업데이트의 순서를 맞추기 위해 함수 안에 사용
            var sql = "update infoboard set creator_id=?, title=?, content=?, image=? where idx=? and passwd=?";

            connection.query(sql,[creator_id, title, content, image, idx, passwd],function(err,result){
              console.log(result);
              if(err) console.error("수정 중 에러 발생 err:",err);

              if(result.affectedRows==0)
              {
                res.send("<script>alert('패스워드가 일치하지 않거나, 잘못된 요청으로 인해 값이 변경되지 않았습니다.');history.back();</script>");
              }
              else
              {
                res.redirect('/infoboard/read_info/'+idx);
              }
              connection.release();
            });

          });
        });
      }
      else{ //기존 파일이 업로드 되지 않았을 경우
        image = newFile;
        pool.getConnection(function(err,connection)
        {
          //새로운 파일명만 업로드, 삭제 필요 x
          var sql = "update infoboard set creator_id=?, title=?, content=?, image=? where idx=? and passwd=?";

          connection.query(sql,[creator_id, title, content, image, idx, passwd],function(err,result){
            console.log(result);
            if(err) console.error("수정 중 에러 발생 err: ",err);

            if(result.affectedRows==0)
            {
              res.send("<script>alert('패스워드가 일치하지 않거나, 잘못된 요청으로 인해 값이 변경되지 않았습니다.');history.back();</script>");
            }
            else
            {
              res.redirect('/infoboard/read_info/'+idx);
            }
            connection.release();
          });
        });
      }
    });
  }
  else{//새로 파일을 업로드 하지 않을 시, 기존 파일 그대로 다른 수정사항만 반영
    pool.getConnection(function(err,connection)
    {
      //데이터베이스의 파일명 등을 바꿔준다.
      //파일 삭제 -> 데이터베이스 업데이트의 순서를 맞추기 위해 함수 안에 사용
      var sql = "update infoboard set creator_id=?, title=?, content=?, image=? where idx=? and passwd=?";

      connection.query(sql,[creator_id, title, content, image, idx, passwd],function(err,result){
        console.log(result);
        if(err) console.error("수정 중 에러 발생 err: ",err);

        if(result.affectedRows==0)
        {
          res.send("<script>alert('패스워드가 일치하지 않거나, 잘못된 요청으로 인해 값이 변경되지 않았습니다.');history.back();</script>");
        }
        else
        {
          res.redirect('/infoboard/read_info/'+idx);
        }
        connection.release();
      });
    });
  }
  /*if (!req.file) {
    var image=null;
    //return res.send('Please upload a file');
  }
  else {
    var image=req.file.filename;
  }

  pool.getConnection(function(err, connection){
    var sql="update infoboard set creator_id=?, title=?, content=?, image=? where idx=?";
    connection.query(sql, [creator_id, title, content, image, idx], function(err, result){
      //console.log(result);
      //if(err) console.error("글 수정 중 에러 발생 err:", err);
      if(err) res.send(err);
      if(result.affectedRows == 0){
        res.send("<script>alert('패스워드가 일치하지 않거나, 잘못된 요청으로 인해 값이 변경되지 않았습니다.');history.back();</script>");
      }
      else{
        res.redirect('/infoboard/read_info/'+idx);
        //res.redirect('/board/');
      }
      connection.release();
    });
  });*/
});

router.post('/delete_info', function (req, res, next) {
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
         res.redirect('/infoboard');
         connection.release();
       });
     });
 });

module.exports = router;
