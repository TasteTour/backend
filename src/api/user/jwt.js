const jwt = require('jsonwebtoken');
const {resolve} = require("express-hbs/lib/resolver");
const privateKey = 'my-secret-key';

/**
 * jwtSign으로 모듈화, JWT 생성하는 함수
 */
exports.jwtSign = (payload, callback) => {
     return new Promise((resolve, reject) => {
         jwt.sign({ foo: 'bar' }, privateKey,
             { expiresIn: '7d' },
             function (err, token) {
                 if(err){
                     reject (err);
                 }
                 resolve(token)
             });
     })
}