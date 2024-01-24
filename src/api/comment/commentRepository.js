const { pool } = require('../../data/index')

/**
 * 댓글 작성
 */
exports.writeComment = async (commentContent, memberNumber, boardNumber, memberName) => {
    const query = `INSERT INTO comment (commentContent, memberNumber, boardNumber, memberName)  VALUES (?,?,?,?)`;
    return await pool(query, [commentContent, memberNumber, boardNumber, memberName]);
}

/**
 * 댓글 수정
 */
exports.updateComment = async (commentContent, commentNumber, memberNumber, boardNumber) => {
    const query = `UPDATE comment SET 
                                    commentContent = IFNULL(?, commentContent),
                                    commentUpdated = NOW()
                        WHERE commentNumber = ? AND memberNumber = ? AND boardNumber = ?`;
    return await pool(query, [commentContent, commentNumber, memberNumber, boardNumber]);
}


/**
 * 댓글 삭제
 */
exports.deleteComment = async (commentNumber, memberNumber) => {
    const query = `DELETE FROM comment WHERE commentNumber = ? AND memberNumber = ?`;

    return await pool(query, [commentNumber, memberNumber]);
}

/**
 * 댓글 조회
 */
exports.readComment = async (boardNumber) => {
    const query = `SELECT * FROM comment WHERE boardNumber = ?`;
    return await pool(query, [boardNumber]);
}

/**
 * 해당 댓글이 존재하는지 확인
 */
exports.isCommentExists = async (commentNumber) => {
    const query = `SELECT * FROM comment WHERE commentNumber = ?`;
    let result = await pool(query, [commentNumber]);
    // result가 0이라면 null 반환 / 있다면 result[0] 반환
    return (result.length === 0) ? null : result[0];
};