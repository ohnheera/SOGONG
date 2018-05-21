var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  var session = req.session;
  var id = session.user_id;
  console.log("id: ", id);
  res.render('index', { title: 'SOGONG', id: id});
});

module.exports = router;
