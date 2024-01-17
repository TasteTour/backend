const jwt = require('./jwt')
const repository = require('./repository')
const crypto = require('crypto')

exports.register = async (req, res) => {
    const {email, password, name} = req.body;
    let count = await repository.find(email);

    if(count > 0){
        return res.send({
            result: "fail", message: '중복된 이메일이 존재합니다.'});
    }
    const result = await crypto.pbkdf2Sync(password, process.env.SALT_KEY,50,100, 'sha512')
    const {affectedRows, insertId} = await repository.register(email, result.toString('base64'), name);

    if (affectedRows > 0){
        const data = await jwt.jwtSign({id : insertId, name});
        res.send({asscess_token : data})
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
