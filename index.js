var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', {
        appToken: "5c6007ce383ee5002262e55d"
    });
});

router.get('/health', function (req, res, next) {
    res.send('OK');
});


module.exports = router;
