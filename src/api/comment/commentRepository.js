const { pool } = require('../../data/index')

/**
 * 댓글 작성
 */
exports.writeComment = async (commentContent, memberNumber, boardNumber) => {
    const query = `INSERT INTO comment (commentContent, memberNumber, boardNumber)  VALUES (?,?,?)`;
    return await pool(query, [commentContent, memberNumber, boardNumber]);
}

/**
 * 댓글 수정
 */
exports.updateComment = async (commentContent, commentNumber, memberNumber, boardNumber) => {
    const query = `UPDATE comment SET 
                                    commentContent = IFNULL(?, commentContent),
                                    commentUpdate = NOW()
                        WHERE commentNumber = ? AND memberNumber = ? AND boardNumber = ?`;
    return await pool(query, [commentContent, commentNumber, memberNumber, boardNumber]);
}


/**
 * 댓글 삭제
 */
exports.deleteComment = async (commentNumber, memberNumber, boardNumber) => {
    const query = `DELETE FROM comment WHERE commentNumber = ? AND memberNumber = ? AND boardNumber = ?`;

    return await pool(query, [commentNumber, memberNumber, boardNumber]);
}