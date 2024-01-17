const jwt = require('./jwt')
const repository = require('./repository')
const crypto = require('crypto')
const { StatusCodes, ReasonPhrases } = require('http-status-codes');

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

    // 정상적으로 회원가입 되었으면
    if (affectedRows > 0){
        const data = {
            memberName: memberName,
            memberEmail: memberEmail,
            memberPhone: memberPhone
        }
        res.status(StatusCodes.CREATED)
        return res.send({ code: StatusCodes.CREATED, httpStatus: ReasonPhrases.CREATED, message: "회원가입 성공했습니다!", data: data});
    }
    else {
        res.send({result: 'fail'})
    }
}

exports.login = async (req, res) => {
    let {email, password} = req.body;
    let result = crypto.pbkdf2Sync(password, process.env.SALT_KEY, 50, 100, 'sha512')

    let item = await repository.login(email, result.toString('base64'))

    if(item == null){
        res.send('{ result : "login fail" }')
    }
    else {
        let token = await jwt.jwtSign({id : email});
        res.send(`{ access_token : ${token} }`)
    }
}

exports.userinfo = (req, res) => {
    const id = req.params.id;
    res.send(`${id} 님의 회원정보`);
}
