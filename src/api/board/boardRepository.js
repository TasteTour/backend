const { pool } = require('../../data/index')

/**
 * 최신 순으로 글 불러오기 (boardNumber의 내림차순)
 * Array Type?
 * @returns {Promise<unknown>}
 */
exports.readLatestBoards = async () => {
    const query = `SELECT * FROM board ORDER BY boardNumber desc`;
    return await pool(query);
}

/**
 * 인기 순으로 글 불러오기
 * @returns {Promise<unknown>}
 */
exports.readPopularityBoards = async () => {
    const query = `SELECT * FROM member WHERE memberEmail = ? AND memberPassword = ?`;
    let result = await pool(query, [memberEmail, memberPassword]);
    return (result.length < 0) ? null : result[0];
}


/**
 * 글 작성하기
 * @returns {Promise<boolean>}
 */
exports.writeBoard = async () => {
    const query = ``;
    let result = await pool(query, [token]);
    // return (result[0]['count(*)'] <= 0) ? false : true;
}

/**
 * 글 수정하기
 * TODO 수정된 부분만 담아서 값 넣기
 * @returns {Promise<boolean>}
 */
exports.updateBoard = async () => {
    const query = ``;
    let result = await pool(query, []);
    // return (result[0]['count(*)'] <= 0) ? false : true;
}

// ========================= //
/* TODO 제가 맡은 파트가 아니였네요.. 하하 */
/**
 * 상세 글 불러오기
 * @param {int} boardNumber
 * @returns null boardNumber가 일치하지 않으면
 */
exports.readBoard = async (boardNumber) => {
    const query = `SELECT * FROM board WHERE boardNumber = ?`;
    let result = await pool(query, [boardNumber]);
    return (result.length < 0) ? null : result[0];
}

/**
 * 게시글 삭체하는 메소드. 글 번호와 작성자가 일치해야 삭제됨
 * @param boardNumer
 * @param memberNumber
 * @returns {Promise<null|*>}
 */
exports.deleteBoard = async (boardNumer, memberNumber) => {
    const query = `DELETE * FROM board WHERE boardNumber = ? and memberNumber = ?`;
    let result = await pool(query, [boardNumber]);
    console.log(result);
    // TODO 리턴 값 확인해서 어떤걸로 리턴 해야 할 지 정해주셔야 해요!
    // return (result.length < 0) ? null : result[0];
}