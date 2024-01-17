const { pool } = require('../../data/index')

/**
 * 회원가입
 * @param email
 * @param paassword
 * @param name
 * @returns {Promise<unknown>}
 */
exports.register = async (email, password, name) => {
    const query = `INSERT INTO user (email, password, name)  VALUES (?,?,?)`;
    return await pool(query, [email, password, name]);
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
 * @returns {Promise<unknown>}
 */
exports.find = async (email) => {
    const query = `SELECT count(*) FROM user WHERE email = ?`;
    let result = await pool(query, [email]);
    console.log(result);
    console.log(result.length);
    return (result.length <= 0) ? null : result.length;

}