const { pool } = require('../../data/index')
// 데이터베이스 모듈화 

/**
 * DB에 file을 저장하는 함수
 * @param {string} name
 * @param {string} path
 * @param {string} size
 * @returns {Promise<unknown>}
 */
exports.create = async (name, path, size, boardNumber) => {
    const query =  `INSERT INTO files (imageName, imagePath, imageSize, boardNumber) VALUES (?,?,?,?)`;
    return await pool(query, [name, path, size, boardNumber]);
}

/**
 * DB에 저장된 파일을 불러오는 함수
 */
exports.show = async (id) => {
    const query =  `SELECT * FROM files WHERE id = ?`;

    // DB에서 결과 가져오기.
    return await pool(query, [id]);
}