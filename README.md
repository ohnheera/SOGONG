# SOGONG
SOGONG project, 2018

<희라>
- 로그인 정보 불러오는 법
  router.get('/', function(req, res, next) {
  var id = null;
  var session = req.session;
  if(session.user_id){  
    res.render('login_t', { title: 'Login' }); //로그인 된것
  }
  else{
    res.render('login_f', { title: 'Login' }); //로그인 안된것
  }
  });
