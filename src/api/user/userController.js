const jwt = require('./jwt')
const repository = require('./userRepository')
const crypto = require('crypto')
const { StatusCodes, ReasonPhrases } = require('http-status-codes');
const {jwtVerify} = require("./jwt");

// TODO : 이메일 인증 기능 추가할지 고민

exports.register = async (req, res) => {
    const {memberName, memberEmail, memberPhone, memberPassword} = req.body;

    /**
     * 기존 이메일 존재하는지 확인하는 메소드
     * @type {false}
     */
    let isExistingEmail = await repository.find(memberEmail);

    if(isExistingEmail){
        res.status(StatusCodes.CONFLICT) // 상태 Conflict로 변경 
        return res.send({ code: StatusCodes.CONFLICT, httpStatus: ReasonPhrases.CONFLICT, message: "이메일 중복으로 회원 가입이 불가합니다!"});
    }

    // 비밀번호 암호화 하여 DB에 저장
    const result = await crypto.pbkdf2Sync(memberPassword, process.env.SALT_KEY,50,100, 'sha512')
    const {affectedRows} = await repository.register(memberName, memberEmail, memberPhone, result.toString('base64'));

    const memberNumber = await repository.findMemberNumberAndMemberName(memberEmail)

    let token = await jwt.jwtSign({id : memberNumber.memberNumber});

    // 정상적으로 회원가입 되었으면
    if (affectedRows > 0){
        const data = {
            memberName: memberName,
            memberEmail: memberEmail,
            memberPhone: memberPhone,
            token: token
        }
        res.status(StatusCodes.CREATED)
        return res.send({ code: StatusCodes.CREATED, httpStatus: ReasonPhrases.CREATED, message: "회원가입 성공했습니다!", data: data});
    }
    else {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR)
        res.send({ code: StatusCodes.INTERNAL_SERVER_ERROR, httpStatus: ReasonPhrases.INTERNAL_SERVER_ERROR, message: "[회원가입] DB 구성 중 오류가 발생했습니다"})
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
        const member = await repository.findMemberNumberAndMemberName(memberEmail);
        let token = await jwt.jwtSign({memberNumber : member.memberNumber, memberName : member.memberName});
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

/**
 * 비밀번호 변경 메소드
 * @param header('Authorization')
 * @returns {Promise<void>}
 */
exports.updatePassword = async (req, res) => {
    const token = req.header('Authorization');
    let { lastMemberPassword, memberPassword } = req.body;

    const lastmemberPasswordResult = await crypto.pbkdf2Sync(lastMemberPassword, process.env.SALT_KEY,50,100, 'sha512')
    const memberPasswordResult = await crypto.pbkdf2Sync(memberPassword, process.env.SALT_KEY,50,100, 'sha512')

    let memberNumber;
    await jwt.jwtVerify(token).then(decoded => {
        memberNumber = decoded.decoded.payload.memberNumber;
    })

    try{
        const { affectedRows, changedRows } = await repository.updatePassword(memberNumber, lastmemberPasswordResult.toString('base64'), memberPasswordResult.toString('base64'));
        if (changedRows > 0){
            res.status(StatusCodes.OK)
            res.send({ code: StatusCodes.OK, httpStatus: ReasonPhrases.OK, message: "비밀번호가 정상적으로 변경되었습니다."})
        }
        else if(affectedRows === 0){
            res.status(StatusCodes.FORBIDDEN)
            res.send({ code: StatusCodes.FORBIDDEN, httpStatus: ReasonPhrases.FORBIDDEN, message: "이전 비밀번호가 일치하지 않습니다."})
        }
    }
    catch (Error){
        res.status(StatusCodes.INTERNAL_SERVER_ERROR)
        res.send({ code: StatusCodes.INTERNAL_SERVER_ERROR, httpStatus: ReasonPhrases.INTERNAL_SERVER_ERROR, message: "[비밀번호 변경] DB 구성 중 오류가 발생했습니다."})
    }
}

