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
 * @TODO 추후 "가입되어 있지 않은 회원입니다" 기능 추가하기
 * @param memberEmail
 * @param memberPassword
 * @returns {Promise<unknown>}
 */
exports.login = async (memberEmail, memberPassword) => {
    const query = `SELECT * FROM member WHERE memberEmail = ? AND memberPassword = ?`;
    let result = await pool(query, [memberEmail, memberPassword]);
    return (result.length < 0) ? null : result[0];
}

/**
 * 이메일 입력하여 일치하는 회원 찾기
 * @param email
 * @returns false (중복된 이메일이 없다면)
 */
exports.find = async (email) => {
    const query = `SELECT count(*) FROM member WHERE memberEmail = ?`;
    let result = await pool(query, [email]);
    return (result[0]['count(*)'] <= 0) ? false : true;
}

/**
 * 이메일 입력하여 회원번호 검색
 * @param email
 * @returns 4 (회원번호)
 */
exports.findMemberNumber = async (email) => {
    const query = `SELECT memberNumber FROM member WHERE memberEmail = ?`;
    let result = await pool(query, [email]);
    return (result.length < 0) ? null : result[0];
}

/**
 * 비밀번호 변경 메소드
 * @param memberNumber
 * @param memberPassword
 * @returns result
 */
exports.updatePassword = async (memberNumber, lastmemberPassword, memberPassword) => {
    const query = `UPDATE member SET memberPassword = ? WHERE memberNumber = ? and memberPassword = ?`;
    let result = await pool(query, [memberPassword, memberNumber, lastmemberPassword]);
    return result;
}

/**
 * 폐기된 토큰인지 확인하는 모듈
 * @param token
 * @returns false (폐기되지 않은 토큰이면)
 */
exports.isRevokedToken = async (token) => {
    const query = `SELECT count(*) FROM revokedToken WHERE revokedTokenID = ?`;
    let result = await pool(query, [token]);
    console.log(result[0]['count(*)'] <= 0 ? false : true)
    return (result[0]['count(*)'] <= 0) ? false : true;
}

/**
 * 토큰을 폐기하는 모듈
 * @param token
 * @returns {Promise<unknown>}
 */
exports.addRevokedToken = async (token) => {
    const query = `INSERT INTO revokedToken (revokedTokenID) VALUES (?)`;
    return await pool(query, [token]);

}

/**
 * 회원번호로 회원 이메일 찾기
 */
exports.findMemberName = async (memberNumber) => {
    const query = `SELECT memberEmail FROM member WHERE memberNumber = ?`;
    let result = await pool(query, [memberNumber]);
    // console.log(result[0].memberEmail);
    return (result.length < 0) ? null : result[0].memberEmail;
}