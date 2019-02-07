var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', {
        appToken: "5c46da91005ceb0028febd3d"
    });
});

router.get('/health', function (req, res, next) {
    res.send('OK');
});


module.exports = router;
