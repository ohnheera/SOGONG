//희라 '/join'

var express = require('express');
var router = express.Router();
var fs = require('fs');
var multer = require('multer');

//이미지 업로드
var upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads/user/petimg/');
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
  database:'test',
  password:'12345'
});


//회원가입 get
router.get('/', function (req, res, next) {
    res.render('join',{title:'회원가입'});
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
  var pic = 0;
  if(req.file != null){
    pic =  req.file.filename; //파일명을 받아온다
  }
  var datas = [id,passwd,name,email,tel,address,gen,birth,pic,petname,petage,petbirth,petgen,pettype];
  console.log("datas: "+datas);

  pool.getConnection(function(err,connection)
  {
    var sql = "SELECT ? FROM userinfo GROUP BY id HAVING COUNT (id) > 1";

    connection.query(sql,id,function(err,rows)
    {
      console.log("rows: "+JSON.stringify(rows[0]));
      if(err) console.error("err: "+err);
      if(rows[0]!=null){
        res.send("<script>alert('아이디가 중복입니다.');history.back();</script>");
      }
      else{
          //use the connection, 파일명 입력
          var sqlForInsertBoard = "insert into userinfo(id,passwd,name,email,tel,address,gen,birth,pic,petname,petage,petbirth,petgen,pettype) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?)";

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
