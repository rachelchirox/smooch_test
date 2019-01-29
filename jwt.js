'use strict';

const jsonwebtoken = require('jsonwebtoken');

// const jwt = jsonwebtoken.sign({
//     scope: 'app'
// }, process.env.SMOOCH_SECRET, {
//     headers: {
//         kid: process.env.SMOOCH_KEY_ID
//     }
// });

const jwt = jsonwebtoken.sign({
    scope: 'app'
}, "yALmS9bSdH9IZf5Hw4TArSTt54k_IqXKrivTraNxbZQPagGoKrhqq5hCpAPY-Md8OXpMnUhB8EzHXEG0blzoBw", {
    headers: {
        kid: "app_5c4d91c9c74c040023423c98",
        typ: 'JWT',
        alg: 'HS256'
    }
});


module.exports = jwt;

// If run directly, print JWT to cmd line 
if (process.argv[1] === __filename) {
    console.log(jwt);
}
