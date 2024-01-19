const { pool } = require('../../data/index')

/**
 * 최신 순으로 글 불러오기 (boardNumber의 내림차순)
 * Array Type?
 * @returns {Promise<unknown>}
 */
exports.readLatestBoards = async () => {
    const query = `SELECT * FROM board ORDER BY boardNumber DESC`;
    return await pool(query);
}

/**
 * 인기 순으로 글 불러오기
 * @note 인기순 : 조회수 * 10 + 댓글 수 -> 내림차순 정렬
 * @returns {Promise<unknown>}
 */
exports.readPopularityBoards = async () => {
    const query = `SELECT * FROM board ORDER BY (boardViews * 10 + boardComment) DESC`;
    return await pool(query, []);
}


/**
 * 글 작성하기
 * @returns {Promise<boolean>}
 */
exports.writeBoard = async (boardTitle, boardStar, boardCategory, boardStoreLocation, boardContent, memberNumber) => {
    const query = `INSERT INTO board (boardTitle, boardStar, boardCategory, boardStoreLocation, boardContent, memberNumber)  VALUES (?,?,?,?,?,?)`;
    return await pool(query, [boardTitle, boardStar, boardCategory, boardStoreLocation, boardContent, memberNumber]);
}

/**
 * 글 수정하기
 * 변경할 수 있는 부분 : 제목, 별점, 카테고리, 위치, 내용
 * @returns {Promise<boolean>}
 */
exports.updateBoard = async (boardTitle, boardStar, boardCategory, boardStoreLocation, boardContent, boardNumber, memberNumber) => {
    const query = `UPDATE board SET 
                                    boardTitle = IFNULL(?, boardTitle),
                                    boardStar = IFNULL(?, boardStar),
                                    boardCategory = IFNULL(?, boardCategory),
                                    boardStoreLocation = IFNULL(?, boardStoreLocation),
                                    boardContent = IFNULL(?, boardContent)  
                        WHERE boardNumber = ? and memberNumber = ?`;
    let result = await pool(query, [boardTitle, boardStar, boardCategory, boardStoreLocation, boardContent, boardNumber, memberNumber]);
    return result;
}

/**
 * 댓글 등록시 board 테이블에 댓글 수 증가
 * TODO 댓글 작성 하실 때 이 메소드도 호출해서 boardComment도 변경하게 해주세요!
 * @param boardNumber
 * @returns 아래 참고 : Controller에서 changedRows로 판단하면 됩니다!
 * ResultSetHeader {
 *   fieldCount: 0,
 *   affectedRows: 1,
 *   insertId: 0,
 *   info: 'Rows matched: 1  Changed: 1  Warnings: 0',
 *   serverStatus: 2,
 *   warningStatus: 0,
 *   changedRows: 1
 * }
 */
exports.boardAddComment = async (boardNumber) => {
    const query = 'UPDATE board SET boardComment = boardComment + 1 WHERE boardNumber = ?';
    let result = await pool(query, [boardNumber]);
    return result;
}

/**
 * 댓글 삭제시 board 테이블에 댓글 수 감소
 * @param boardNumber
 * @returns {Promise<void>}
 */
exports.boardDeleteComment = async (boardNumber) => {
    const query = 'UPDATE board SET boardComment = boardComment -1 WHERE boardNumber = ?';
    let result = await pool(query, [boardNumber])
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