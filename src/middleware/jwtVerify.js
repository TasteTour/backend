require('dotenv').config();

const jwt = require('jsonwebtoken');
const {isRevokedToken} = require("../api/user/userRepository");
const { StatusCodes, ReasonPhrases } = require('http-status-codes');
const privatekey = process.env.JWT_KEY;

module.exports = async (req, res, next) => {
    const token = req.header('Authorization');

    jwt.verify(token, privatekey, function (err, decoded){
        if (err) {
            res.status(StatusCodes.UNAUTHORIZED)
            return res.send({ code: StatusCodes.UNAUTHORIZED, httpStatus: ReasonPhrases.UNAUTHORIZED, message: "정상적인 토큰이 아닙니다."})
        }
        req.user = decoded;
        next();
    });
}