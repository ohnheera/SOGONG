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
      cb(null, 'uploads-/user/petimg/');
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
      var sql="select point,id,passwd,name,email,tel,address,gen,birth,pic,petname,petage,petbirth,petgen,pettype,interest0,interest1,interest2,interest3 from userinfo where id = ?";

      connection.query(sql,[user_id],function(err,row)
      {
        if(err) console.error(err);
        res.render('mypage',{title:"My Page", row:row[0], id:user_id});
        connection.release();
      });
    });
  }
  }
  else{
    res.redirect('/login')
  }
});

//주문내역 조회
router.get('/history', function(req, res, next) {
  var id = null;
  var session = req.session;
  var user_id = session.user_id;
  if(user_id)
  {
    pool.getConnection(function(err,connection)
    {
      var sql="select product,date,price from payment where id = ?";

      connection.query(sql,[user_id],function(err,row)
      {
        if(err) console.error(err);
        console.log("주문조회 정보:", row);
        res.render('history_view',{title:"View", row, id:user_id});
        connection.release();
      });
    });
  }
  else{
    res.redirect('/login')
  }
});

//관리자 메뉴, seller와 manager의 비밀번호를 변경할수 있다.
router.get('/manage', function(req, res, next) {
  var id = null;
  var session = req.session;
  var user_id = session.user_id;
  if(user_id == "manager")
  {
    pool.getConnection(function(err,connection)
    {
      var sql="select pic from userinfo where id = ?";
      connection.query(sql,[user_id],function(err,row)
      {
        if(err) console.error(err);
        console.log("기존 팝업 이미지 조회: ", row[0].pic);
        res.render('manage',{title:"Manage",pic:row[0].pic, id:user_id});
        connection.release();
      });
    });
  }
  else{
    res.redirect('/login')
  }
});

//관리자, 판매자 비밀번호 수정 및 팝업창 관리
router.post('/manager',upload.single('popup'),function(req,res,next){
  var pwd_seller = req.body.password_seller;
  var pwd_manager = req.body.password_manager;
  var original_file = req.body.pic;
  var newFile = req.body.pic;
  if(req.file != null){
    newFile =  req.file.filename;
  }
  pool.getConnection(function(err,connection)
  {
    if(err) console.error("커넥션 객체 얻어오기 에러 : ",err);
    var sql = "update userinfo set pic=?,passwd=? where id = ?";
    if(newFile != original_file && original_file != null){
      fs.exists('uploads-/user/petimg/' + original_file, function(exists){ //기존 파일 존재 확인
        if(exists == true){
          console.log("기존 팝업 이미지 존재, 삭제", original_file);
          fs.unlink('uploads-/user/petimg/' + original_file,function(err){ //기존 파일 삭제
            if(err) throw err;
          });
        }});
        connection.query(sql,[newFile,pwd_manager,"manager"],function(err,row){
          console.log(row);
          if(err) console.error("관리 중 에러 발생 err: ",err);
          if(row == 0)
          {
            res.send("<script>alert('오류 발생.');history.back();</script>");
          }
            sql = "update userinfo set passwd=? where id = ?";
            connection.query(sql,[pwd_seller,"seller"],function(err,row){
              console.log(row);
              if(err) console.error("관리 중 에러 발생 err: ",err);
              if(row == 0)
              {
                res.send("<script>alert('오류 발생.');history.back();</script>");
              }
              res.redirect('/');
              connection.release();
          });
        });
    }
    else{
      connection.query(sql,[newFile,pwd_manager,"manager"],function(err,row){
        console.log(row);
        if(err) console.error("관리 중 에러 발생 err: ",err);
        if(row == 0)
        {
          res.send("<script>alert('오류 발생.');history.back();</script>");
        }
          sql = "update userinfo set passwd=? where id = ?";
          connection.query(sql,[pwd_seller,"seller"],function(err,row){
            console.log(row);
            if(err) console.error("관리 중 에러 발생 err: ",err);
            if(row == 0)
            {
              res.send("<script>alert('오류 발생.');history.back();</script>");
            }
            res.redirect('/');
            connection.release();
        });
      });
    }



  });
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



//포인트 뷰
router.get('/pointview', function(req, res, next) {
  var session = req.session;
  var user_id = session.user_id;
  if(user_id){
    pool.getConnection(function(err,connection)
    {
      var sql="select order_num,point,date from point where id = ?";
      connection.query(sql,[user_id],function(err,rows)
      {
        if(err) console.error(err);
        console.log("포인트 이력 조회를 위한 정보 조회: ", rows);
        res.render('point_view',{title:"point", rows:rows, id: user_id});
        connection.release();
      });
    });
  }
  else{
    console.log("포인트 정보 조회 실패");
    res.redirect('/users');
    connection.release();
  }
});


//로그인 된 user만 접근 가능, 로그인 안된 사용자는 login page로 redirect 'users/view'
router.get('/view', function(req, res, next) {
  var id = null;
  var session = req.session;
  var user_id = session.user_id;
  console.log("User id: ", user_id);
  if(user_id){
    pool.getConnection(function(err,connection)
    {
      var sql="select id,passwd,name,email,tel,address,gen,birth,pic,petname,petage,petbirth,petgen,pettype,interest0,interest1,interest2,interest3 from userinfo where id = ?";

      connection.query(sql,[user_id],function(err,row)
      {
        if(err) console.error(err);
        console.log("사용자 정보 조회 결과 확인: ", row);
        res.render('users',{title:"정보 조회", row:row[0], id: user_id});
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
      var sql="select id,passwd,name,email,tel,address,birth,pic,petname,petage,petbirth,petgen,pettype,interest0,interest1,interest2,interest3 from userinfo where id = ?";
      connection.query(sql,[user_id],function(err,row)
      {
        if(err) console.error(err);
        console.log("사용자 정보 수정을 위한 조회 결과 확인: ", row);
        res.render('user_info_edit',{title:"정보 수정", row:row[0], id:user_id});
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
router.post('/edit',upload.single('pic'),function(req,res,next){
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
  var pic = req.body.upFile; //기존 파일
  var newFile = null; //새로운 파일
  var session = req.session;
  var user_id = session.user_id;
  var interest0 = 0;
  var interest1 = 0;
  var interest2 = 0;
  var interest3 = 0;
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
    newFile =  req.file.filename;
  }
  console.log("기존 파일: " + pic);
  if(pic != null && newFile != null){ //기존 파일 존재, 삭제 후 새로운 파일 업로드
    console.log("새로운 파일 업로드, 기존 이미지 삭제");
    fs.exists('uploads-/user/petimg/' + pic, function(exists){ //기존 파일이 존재할 시 아래의 코드 실행
      if(exists == true){
        fs.unlink('uploads-/user/petimg/' + pic,function(err){ //기존 파일 삭제
          if(err) throw err;
          pic = newFile;
          pool.getConnection(function(err,connection)
          {
            if(err) console.error("회원정보 수정 중 에러 발생 err: ",err);
            //데이터베이스의 파일명 등을 바꿔준다.
            //파일 삭제 -> 데이터베이스 업데이트의 순서를 맞추기 위해 함수 안에 사용
            var sql = "update userinfo set name=?,email=?,tel=?,address=?,birth=?,pic=?,petname=?,petage=?,petbirth=?,petgen=?,pettype=?,interest0=?,interest1=?,interest2=?,interest3=? where id=? and passwd=?";
            console.log("정보 수정 data: ",name,email,tel,address,birth,pic,petname,petage,petbirth,petgen,pettype,interest0,interest1,interest2,interest3);

            connection.query(sql,[name,email,tel,address,birth,pic,petname,petage,petbirth,petgen,pettype,,interest0,interest1,interest2,interest3,id,passwd],function(err,result){
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
          if(err) console.error("회원정보 수정 중 에러 발생 err: ",err);
          console.log("정보 수정 data: ",name,email,tel,address,birth,pic,petname,petage,petbirth,petgen,pettype,interest0,interest1,interest2,interest3);
          //새로운 파일명만 업로드, 삭제 필요 x
          var sql = "update userinfo set name=?,email=?,tel=?,address=?,birth=?,pic=?,petname=?,petage=?,petbirth=?,petgen=?,pettype=?,interest0=?,interest1=?,interest2=?,interest3=? where id=? and passwd=?";

          connection.query(sql,[name,email,tel,address,birth,pic,petname,petage,petbirth,petgen,pettype,interest0,interest1,interest2,interest3,id,passwd],function(err,result){
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
      var sql = "update userinfo set name=?,email=?,tel=?,address=?,birth=?,pic=?,petname=?,petage=?,petbirth=?,petgen=?,pettype=?,interest0=?,interest1=?,interest2=?,interest3=? where id=? and passwd=?";
      console.log("정보 수정 data: ",name,email,tel,address,birth,pic,petname,petage,petbirth,petgen,pettype,interest0,interest1,interest2,interest3);

      connection.query(sql,[name,email,tel,address,birth,pic,petname,petage,petbirth,petgen,pettype,interest0,interest1,interest2,interest3,id,passwd],function(err,result){
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

module.exports = router;
