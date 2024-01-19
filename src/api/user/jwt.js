require('dotenv').config();

const jwt = require('jsonwebtoken');
const privateKey = process.env.JWT_KEY;

/**
 * jwtSign으로 모듈화, JWT 생성하는 함수
 * @memo 토큰 유효시간 : 6시간
 */
exports.jwtSign = (payload, callback) => {
     return new Promise((resolve, reject) => {
         jwt.sign({payload}, privateKey,
             { expiresIn: '6h' },
             function (err, token) {
                 if(err){
                     reject (err);
                 }
                 resolve(token)
             });
     })
}

exports.jwtVerify = (token) => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, privateKey, (err, decoded) => {
            if (err) {
                reject(err);
            }
            resolve({decoded});
        });
    });
}