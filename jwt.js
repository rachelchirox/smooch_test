'use strict';

const jsonwebtoken = require('jsonwebtoken');

const config = require('config');
    // smoochSecret = 'REzKIDmk0M5q9E29nhVgY1Bt3ks0ssysEgN7iwX_NyaK7p-mwWZYVgr2c5bNfU6SwI4KL8wG6LsRaqI2uZCFEA',//config.get('smoochSecret'),
    // kid = 'act_5c975541d85c07001076f8b3'//config.get('kid');
//
const smoochSecret = config.get('smoochSecret');
    const kid = config.get('kid');

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


// const KEY_ID = 'act_5c975541d85c07001076f8b3';
// const SECRET = 'dGmDNGFmxGoIwFm6cxLRPzo8lG40UZm9cqV1u-q2nj5c4GLbIwF31W_415080J34EotpZ19CV1ENIy9vFaBT3w';
//
// const jwt =jsonwebtoken.sign({
//             scope: 'account'
//         },
//         SECRET,
//         {
//             header: {
//                 kid: KEY_ID,
//                 typ: 'JWT',
//                 alg: 'HS256'
//             }
//         });
//
// console.log('jwt:'+jwt)

module.exports = jwt;

// If run directly, print JWT to cmd line 
if (process.argv[1] === __filename) {
    console.log(jwt);
}
