//마이페이지
//희라: 회원정보 조회 & 수정
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
  }),
});

//mysql 코드
var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit:5,
  host:'localhost',
  user:'root',
  database:'project3',
  password:'12345'
});

//Mypage '/users'
router.get('/', function(req, res, next) {
  var id = null;
  var session = req.session;
  var user_id = session.user_id;
  if(user_id){if(user_id)
  {
    pool.getConnection(function(err,connection)
    {
      var sql="select id,passwd,name,email,tel,address,gen,birth,pic,petname,petage,petbirth,petgen,pettype from userinfo where id = ?";

      connection.query(sql,[user_id],function(err,row)
      {
        if(err) console.error(err);
        res.render('mypage',{title:"My Page", row:row[0]});
        connection.release();
      });
    });
  }
  }
  else{
    res.redirect('/login')
  }
});

router.post('/', function(req, res, next) {
  var id = null;
  var session = req.session;
  var user_id = session.user_id;
  if(user_id){
    res.redirect('/edit');
  }
  else{
    if(err) console.error(err);
    console.log("로그인 정보 조회 실패");
  }
});


//로그인 된 user만 접근 가능, 로그인 안된 사용자는 login page로 redirect 'users/view'
router.get('/view', function(req, res, next) {
  var session = req.session;
  var user_id = session.user_id;
  console.log("User id: ", user_id);
  if(user_id){
    pool.getConnection(function(err,connection)
    {
      var sql="select id,passwd,name,email,tel,address,gen,birth,pic,petname,petage,petbirth,petgen,pettype from userinfo where id = ?";

      connection.query(sql,[user_id],function(err,row)
      {
        if(err) console.error(err);
        console.log("사용자 정보 조회 결과 확인: ", row);
        res.render('users',{title:"정보 조회", row:row[0]});
        connection.release();
      });
    });

  }
  else{
    res.redirect('/login')
  }
});


//정보 수정
router.get('/edit', function(req, res, next) {
  var session = req.session;
  var user_id = session.user_id;
  if(user_id){
    pool.getConnection(function(err,connection)
    {
      var sql="select id,passwd,name,email,tel,address,birth,pic,petname,petage,petbirth,petgen,pettype from userinfo where id = ?";
      connection.query(sql,[user_id],function(err,row)
      {
        if(err) console.error(err);
        console.log("사용자 정보 수정을 위한 조회 결과 확인: ", row);
        res.render('user_info_edit',{title:"정보 수정", row:row[0]});
        connection.release();
      });
    });
  }
  else{
    console.log("로그인 정보 조회 실패");
    res.redirect('/login');
    connection.release();
  }
});

//정보수정 POST, 새로운 이미지를 업로드한다, 이미가 없으면 업로드되지 않는다.
router.post('/update',upload.single('image'),function(req,res,next){
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
  var pic = req.body.pic;
  var session = req.session;
  var user_id = session.user_id;

  if(req.file != null){
    var newFile =  req.file.filename;
  }
  else {
    newFile = null;
  }
  console.log("기존 파일: " + pic);
  if(newFile != null){
    console.log("새로운 파일 업로드, 기존 이미지 삭제");
    fs.exists('./uploads/user/petimg/' + pic, function(exists){ //기존 파일이 존재할 시 아래의 코드 실행
      if(exists == true){
        fs.unlink('./uploads/user/petimg/' + pic,function(err){ //기존 파일 삭제
          if(err) throw err;
          pic = newFile;
          pool.getConnection(function(err,connection)
          {
            //데이터베이스의 파일명 등을 바꿔준다.
            //파일 삭제 -> 데이터베이스 업데이트의 순서를 맞추기 위해 함수 안에 사용
            var sql = "update userinfo set name=?,email=?,tel=?,address=?,birth=?,pic=?,petname=?,petage=?,petbirth=?,petgen=?,pettype=? where id=? and passwd=?";

            connection.query(sql,[name,email,tel,address,birth,pic,petname,petage,petbirth,petgen,pettype,id,passwd],function(err,result){
              console.log(result);
              if(err) console.error("회원정보 수정 중 에러 발생 err: ",err);

              if(result.affectedRows==0)
              {
                res.send("<script>alert('패스워드가 일치하지 않거나, 잘못된 요청으로 인해 값이 변경되지 않았습니다.');history.back();</script>");
              }
              else
              {
                res.redirect('/users');
              }
              connection.release();
            });

          });
        });
      }
      else{ //기존 파일이 업로드 되지 않았을 경우
        pic = newFile;
        pool.getConnection(function(err,connection)
        {
          //새로운 파일명만 업로드, 삭제 필요 x
          var sql = "update userinfo set name=?,email=?,tel=?,address=?,birth=?,pic=?,petname=?,petage=?,petbirth=?,petgen=?,pettype=? where id=? and passwd=?";

          connection.query(sql,[name,email,tel,address,birth,pic,petname,petage,petbirth,petgen,pettype,id,passwd],function(err,result){
            console.log(result);
            if(err) console.error("회원정보 수정 중 에러 발생 err: ",err);

            if(result.affectedRows==0)
            {
              res.send("<script>alert('패스워드가 일치하지 않거나, 잘못된 요청으로 인해 값이 변경되지 않았습니다.');history.back();</script>");
            }
            else
            {
              res.redirect('/users');
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
      var sql = "update userinfo set name=?,email=?,tel=?,address=?,birth=?,pic=?,petname=?,petage=?,petbirth=?,petgen=?,pettype=? where id=? and passwd=?";

      connection.query(sql,[name,email,tel,address,birth,pic,petname,petage,petbirth,petgen,pettype,id,passwd],function(err,result){
        console.log(result);
        if(err) console.error("회원정보 수정 중 에러 발생 err: ",err);

        if(result.affectedRows==0)
        {
          res.send("<script>alert('패스워드가 일치하지 않거나, 잘못된 요청으로 인해 값이 변경되지 않았습니다.');history.back();</script>");
        }
        else
        {
          res.redirect('/users');
        }
        connection.release();
      });
    });
  }
  console.log("업로드 파일: " + upFile);
});

module.exports = router;
