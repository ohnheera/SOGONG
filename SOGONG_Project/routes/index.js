var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  var session = req.session;
  var id = session.user_id;
  console.log("id: ", id);
  if(id == null){
    res.render('index', { title: 'SOGONG', id: id});
  }
  else{
    res.render('index2', { title: 'SOGONG', id: id});
  }
});

module.exports = router;
