// require() : 다른 file import
const repository = require('./commentRepository')
const crypto = require('crypto')
const { StatusCodes, ReasonPhrases } = require('http-status-codes');
const {jwtVerify} = require("../user/jwt");

/**
 * 댓글 작성
 */
exports.writeComment = async (req, res) => {
    let { commentContent, boardNumber } = req.body
    let token = req.header.Authorization;
    let memberNumber = await jwtVerify(token);

    let { affectedRows } = await repository.writeComment(commentContent, memberNumber, boardNumber);

    if (affectedRows  > 0) {
        res.status(StatusCodes.CREATED)
        res.send({ code: StatusCodes.CREATED, httpStatus: ReasonPhrases.CREATED, message: "정상적으로 댓글이 등록되었습니다."})
    }
    else{
        res.status(StatusCodes.INTERNAL_SERVER_ERROR)
        res.send({ code: StatusCodes.INTERNAL_SERVER_ERROR, httpStatus: ReasonPhrases.INTERNAL_SERVER_ERROR, message: "댓글 등록 중 오류가 발생했습니다"})
    }
}

/**
 * 댓글 수정
 */
exports.updateComment = async (req, res) => {

}

/**
 * 댓글 삭제
 */
exports.deleteComment = async (req, res) => {

}