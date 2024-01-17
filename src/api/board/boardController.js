/**
 * 피드 목록 조회 (GET)
 * query 방식 
 */
exports.index = (req, res) => {
    const query = req.query
    res.send(query);
}

/**
 * 피드 게시글 등록 (POST)
 * body 방식
 */
exports.store = (req, res) => {
    const body = req.body;
    res.send(body);
}

/**
 * 피드 상세 조회 (GET)
 */
exports.show = (req, res) => {
    const id = req.params.id;
    res.send(`${id} 피드 조회`);
}

/**
 * 피드 업데이트 (POST)
 */
exports.update = (req, res) => {
    const id = req.params.id;
    res.send(`${id} 피드 수정`);
}

/**
 * 피드 삭제 (POST)
 */
exports.destroy = (req, res) => {
    const id = req.params.id;
    res.send(`${id} 피드 삭제`);
}