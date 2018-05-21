# SOGONG
SOGONG project, 2018

- 로그인 정보 불러오는 법
  router.get('/', function(req, res, next) {
  var id = null;
  var session = req.session;
  if(session.user_id){   //로그인시 id에 아이디 저장
    res.render('login_t', { title: 'Login' });
  }
  else{
    res.render('login_f', { title: 'Login' });
  }
});
