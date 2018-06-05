//희라 : 로그인, 로그아웃, 탈퇴하기

//로그인 정보 세션 사용 :
//https://jiwondh.github.io/2017/01/29/session/
//session 설치: npm install session
var express = require('express');
var router = express.Router();
var fs = require('fs');

/*
로그인 & 탈퇴 - 데이터베이스 (Userinfo)
id, pwd,ismanager
*/

//mysql 코드
var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit:5,
  host:'localhost',
  user:'root',
  database:'project3',
  password:'12345'
});

//로그인 페이지
router.get('/', function(req, res, next) {
  var id = null;
  var session = req.session;
  var user_id = session.user_id;
  res.render('login', { title: 'Login' , id:id});
});

//로그인 유효 검사 - 아이디, 비밀번호 일치 확인 후, 맞으면 main으로 redirect/ 틀리면 login으로 redirect
router.post('/',function(req,res,next){
  var id = req.body.id;
  var passwd = req.body.password;
  var session = req.session;
  pool.getConnection(function(err,connection)
  {
    if(err) console.error("커넥션 객체 얻어오기 에러 : ",err);
    var sql="select id,passwd from userinfo where id=? and passwd=?";
    connection.query(sql,[id,passwd],function(err,row){
      console.log(row);
      if(err) console.error("로그인 중 에러 발생 err: ",err);
      if(row == 0)
      {
        res.send("<script>alert('아이디/패스워드가 일치하지 않습니다.');history.back();</script>");
      }
      else {
        session.user_id = id; //세션에 'id'로 id 등록
				res.redirect('/');
      }
      connection.release();
    });
  });
});


//탈퇴하기
router.get('/cancel', function(req, res, next) {
  var session = req.session;
  var id = session.user_id;
  pool.getConnection(function(err,connection)
  {
    if(err) console.error("커넥션 객체 얻어오기 에러 : ",err);
    var sql="select pic from userinfo where id=?";
    connection.query(sql,[id],function(err,row){
      console.log(row);
      if(err) console.error("탈퇴 중 에러 발생 err: ",err);
      res.render('cancel', { title: '탈퇴하기', row:row[0], id:id});
      connection.release();
    });
  });
});

router.post('/cancel',function(req,res,next){
  var idx = req.body.id;
  var passwd = req.body.passwd;
  var upFile =req.body.pic;
  var pw =req.body.pw;
  console.log("파일명: ",upFile);
  console.log(idx + " " + passwd);

  pool.getConnection(function(err,connection)
  {
    var sql = "delete from userinfo where id=?"; //삭제
    connection.query(sql,[idx,passwd],function(err,result){
      console.log(result);
      if(err) console.error("탈퇴 중 에러 발생 err: ",err);
      if(result.affectedRows==0)
      {
        res.send("<script>alert('비밀번호와 아이-를 다시 확인하세요.');history.back();</script>");
      }
      else {
        delete req.session.user_id;//session에서 사용자 정보 삭제
        fs.exists('./uploads-/user/petimg/' + upFile, function(exists){ //파일이 존재시 삭제
          console.log("탈퇴: 파일 존재", "./uploads-/user/petimg/" , upFile);
          if(exists == true){
            fs.unlink('./uploads/user/petimg/'+upFile,function(err){
              console.log("탈퇴: 파일 삭제", "./uploads-/user/petimg/" , upFile);
              if(err) throw err;
            });
          }
        });
        delete req.session.user_id;//session에서 사용자 정보 삭제
        res.redirect('/');
      }
      connection.release();
    });
  });
});


//로그아웃
router.get('/logout', function(req, res, next) {
  delete req.session.user_id;//session에서 사용자 정보 삭제
  res.redirect('/');
});



module.exports = router;
