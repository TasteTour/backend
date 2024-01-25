const { pool } = require('../../data/index')
// 데이터베이스 모듈화 

/**
 * DB에 file을 저장하는 함수
 * @param {string} name
 * @param {string} path
 * @param {string} size
 * @returns {Promise<unknown>}
 */
exports.create = async (name, path, size) => {
    const query2 = 'SELECT max(boardNumber)+1 from image';
    const result2 = await pool(query2, []);

    const query =  `INSERT INTO image (imageName, imagePath, imageSize, boardNumber) VALUES (?,?,?,?)`;
    const result = await pool(query, [name, path, size, result2[0]['max(boardNumber)+1']]);
    console.log(result)
    return result;
}

/**
 * DB에 저장된 파일을 불러오는 함수
 */
exports.show = async (boardNumber) => {
    const query =  `SELECT * FROM image WHERE boardNumber = ?`;

    // DB에서 결과 가져오기.
    return await pool(query, [boardNumber]);
}