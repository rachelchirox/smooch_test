'use strict';

const jsonwebtoken = require('jsonwebtoken');

const config = require('config'),
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
