'use strict';

const jsonwebtoken = require('jsonwebtoken');

const config = require('config'),
    // smoochSecret = 'REzKIDmk0M5q9E29nhVgY1Bt3ks0ssysEgN7iwX_NyaK7p-mwWZYVgr2c5bNfU6SwI4KL8wG6LsRaqI2uZCFEA',//config.get('smoochSecret'),
    // kid = 'act_5c975541d85c07001076f8b3'//config.get('kid');

    smoochSecret = config.get('smoochSecret'),
    kid = config.get('kid');

// const jwt = jsonwebtoken.sign({
//     scope: 'app'
// }, process.env.SMOOCH_SECRET, {
//     headers: {
//         kid: process.env.SMOOCH_KEY_ID
//     }
// });

const jwt = jsonwebtoken.sign({
    scope: 'app'
}, smoochSecret, {
    headers: {
        kid: kid,
        typ: 'JWT',
        alg: 'HS256'
    }
});


module.exports = jwt;

// If run directly, print JWT to cmd line 
if (process.argv[1] === __filename) {
    console.log(jwt);
}
