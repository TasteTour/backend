const { pool } = require('../../data/index')

/**
 * 회원 가입
 * @param memberName
 * @param memberEmail
 * @param memberPhone
 * @param memberPassword
 * @returns {Promise<unknown>}
 */
exports.register = async (memberName, memberEmail, memberPhone, memberPassword) => {
    const query = `INSERT INTO member (memberName, memberEmail, memberPhone, memberPassword)  VALUES (?,?,?,?)`;
    return await pool(query, [memberName, memberEmail, memberPhone, memberPassword]);
}

/**
 * 로그인
 * @param email
 * @param paassword
 * @returns {Promise<unknown>}
 */
exports.login = async (email, password) => {
    const query = `SELECT * FROM user WHERE email = ? AND password = ?`;
    let result = await pool(query, [email, password]);
    return (result.length < 0) ? null : result[0];
}

/**
 * @TODO result에서 값만 추출하는 방법 찾기
 * 이메일 입력하여 일치하는 회원 찾기
 * @param email
 * @param paassword
 * @param name
 * @returns false (중복된 이메일이 없다면)
 */
exports.find = async (email) => {
    const query = `SELECT count(*) FROM member WHERE memberEmail = ?`;
    let result = await pool(query, [email]);
    return (result[0]['count(*)'] <= 0) ? false : true;

}