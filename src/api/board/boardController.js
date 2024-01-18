const repository = require('./boardRepository')
const crypto = require('crypto')
const { StatusCodes, ReasonPhrases } = require('http-status-codes');

/**
 * 최신순으로 글 조회하기
 * @apiNote DB 오류 발생 시 404 오류 발생
 * @apiNote 글은 Array 형태로 반환함
 * [
 *  {
 *      boardNumber: 2, ...
 *  },
 *  {
 *      boardNumber: 1, ...
 *  }
 * ]
 */
exports.readLatestBoards = async (req, res) => {

    let item = await repository.readLatestBoards();

    if(item == null){
        res.status(StatusCodes.INTERNAL_SERVER_ERROR)
        res.send({ code: StatusCodes.INTERNAL_SERVER_ERROR, httpStatus: ReasonPhrases.INTERNAL_SERVER_ERROR, message: "글 최신 순 조회 중에 오류가 발생했습니다"})
    }
    else{
        res.status(StatusCodes.OK)
        res.send({ code: StatusCodes.OK, httpStatus: ReasonPhrases.OK, message: "글 최신순 조회입니다.", data: item})
    }
}

exports.readPopularBoards = async (req, res) => {
    let item = await repository.readPopularBoards();

    if(item == null){
        res.status(StatusCodes.INTERNAL_SERVER_ERROR)
        res.send({ code: StatusCodes.INTERNAL_SERVER_ERROR, httpStatus: ReasonPhrases.INTERNAL_SERVER_ERROR, message: "글 인기 순 조회 중에 오류가 발생했습니다"})
    }
    else{
        res.status(StatusCodes.OK)
        res.send({ code: StatusCodes.OK, httpStatus: ReasonPhrases.OK, message: "글 인기순 조회입니다.", data: item})
    }
}

exports.login = async (req, res) => {
    let {memberEmail, memberPassword} = req.body;
    let result = crypto.pbkdf2Sync(memberPassword, process.env.SALT_KEY, 50, 100, 'sha512')

    let item = await repository.login(memberEmail, result.toString('base64'))

    if(item == null){
        res.status(StatusCodes.UNAUTHORIZED)
        res.send({ code: StatusCodes.UNAUTHORIZED, httpStatus: ReasonPhrases.UNAUTHORIZED, message: "이메일 또는 비밀번호가 틀립니다"})
    }
    else {
        let token = await jwt.jwtSign({id : memberEmail});
        const data = {
            memberName: item.memberName,
            memberEmail: item.memberEmail,
            memberPhone: item.memberPhone,
            Authorization: token
        }
        res.status(StatusCodes.OK)
        return res.send({ code: StatusCodes.OK, httpStatus: ReasonPhrases.OK, message: `${item.memberName}님 로그인 되었습니다.`, data: data});

    }
}

/**
 * 로그아웃 하는 메소드
 * @param header('Authorization')
 * @param res
 * @returns {Promise<void>}
 */
exports.logout = async (req, res) => {
    const token = req.header('Authorization');
    console.log(token)
    try{
        const {affectedRows} = await repository.addRevokedToken(token);
        if (affectedRows > 0){
            res.status(StatusCodes.OK)
            res.send({ code: StatusCodes.OK, httpStatus: ReasonPhrases.OK, message: "정상적으로 로그아웃 되었습니다."})
        }
    }
    catch (Error){
        res.status(StatusCodes.UNAUTHORIZED)
        res.send({ code: StatusCodes.UNAUTHORIZED, httpStatus: ReasonPhrases.UNAUTHORIZED, message: "이미 폐기된 토큰입니다."})
    }
}
