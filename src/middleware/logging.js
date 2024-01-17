// 보안을 위한 Middleware

/**
 * 클라이언트 IP를 확인하기 위한 메소드
 * @param req
 * @param res
 * @param next
 */
module.exports = (req, res, next) => {
    let clientIp = req.ip;
    console.log(`${clientIp.replace("::ffff:","")} : ${req.path}`);
    next();
}