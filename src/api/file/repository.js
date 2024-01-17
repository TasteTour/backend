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
    const query =  `INSERT INTO files (original_name, file_path, file_size) VALUES (?,?,?)`;
    return await pool(query, [name, path, size]);
}

/**
 * DB에 저장된 파일을 불러오는 함수
 * @param id
 * @returns {Promise<null|*>}
 */
exports.show = async (id) => {
    const query =  `SELECT * FROM files WHERE id = ?`;

    // DB에서 결과 가져오기.
    let result = await pool(query,[id]);
    return (result.length < 1) ? null: result[0];
}