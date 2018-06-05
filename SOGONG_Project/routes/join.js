//희라 '/join'

var express = require('express');
var router = express.Router();
var fs = require('fs');
var multer = require('multer');

//이미지 업로드
var upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads-/user/petimg/');
    },
    filename: function (req, file, cb) {
      cb(null, new Date().valueOf() + file.originalname);
    }
  }),});

//mysql 코드
var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit:5,
  host:'localhost',
  user:'root',
  database:'project3',
  password:'12345'
});


//회원가입 get
router.get('/', function (req, res, next) {
    res.render('join',{title:'회원가입', id:null});
    var session = req.session;
    var id=session.user_id;

    res.render('join',{title:'회원가입', id: session.user_id});
});

//회원가입 post
router.post('/',upload.single('pic'), function(req,res,next){
  var id = req.body.id;
  var passwd = req.body.passwd;
  var name = req.body.name;
  var email = req.body.email;
  var tel = req.body.tel1 + req.body.tel2 + req.body.tel3;
  var address = req.body.address;
  var gen = req.body.gen;
  var birth = req.body.birth;
  var petname = req.body.petname;
  var petage = req.body.petage;
  var petbirth = req.body.petbirth;
  var petgen = req.body.petgen;
  var pettype = req.body.pettype;
  var interest0 = 0;
  var interest1 = 0;
  var interest2 = 0;
  var interest3 = 0;
  var pic = 0;
  if(req.body.checkbox0){
    interest0 = 1;
  }
  if(req.body.checkbox1){
    interest1 = 1;
  }
  if(req.body.checkbox2){
    interest2 = 1;
  }
  if(req.body.checkbox3){
    interest3 = 1;
  }
  if(req.file != null){
    pic =  req.file.filename; //파일명을 받아온다
  }
  var datas = [id,passwd,name,email,tel,address,gen,birth,pic,petname,petage,petbirth,petgen,pettype,interest0,interest1,interest2,interest3];
  console.log("datas: "+datas);

  pool.getConnection(function(err,connection)
  {
    var sql = "SELECT id FROM userinfo where id = ?";

    connection.query(sql,id,function(err,rows)
    {
      console.log("rows: " + rows);
      if(err) console.error("err: "+err);
      if(rows[0]!=null){
        res.send("<script>alert('아이디가 중복입니다.');history.back();</script>");
      }
      else{
          //use the connection, 파일명 입력
          var sqlForInsertBoard = "insert into userinfo(id,passwd,name,email,tel,address,gen,birth,pic,petname,petage,petbirth,petgen,pettype,interest0,interest1,interest2,interest3) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";

          connection.query(sqlForInsertBoard,datas,function(err,rows)
          {
            if(err) console.error("err: "+err);
            console.log("rows: "+JSON.stringify(rows));
            res.redirect('/login');
            connection.release();
          });
      }
    });

  });
});

module.exports = router;
