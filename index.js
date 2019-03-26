var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', {
        appToken: "5c9741745e53740010af989f"
    });
});

router.get('/health', function (req, res, next) {
    res.send('OK');
});


module.exports = router;
