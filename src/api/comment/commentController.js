// require() : 다른 file import
const repository = require('./commentRepository');
const boardrepository = require('../board/boardRepository');
const crypto = require('crypto');
const { StatusCodes, ReasonPhrases } = require('http-status-codes');
const jwt = require("../user/jwt");

/**
 * 댓글 작성
 */
exports.writeComment = async (req, res) => {
    try {
        let { commentContent, boardNumber } = req.body;
        if (!commentContent) {
            return res.status(StatusCodes.BAD_REQUEST).send({message: "댓글을 다시 작성해주세요."});
        }

        let token = req.headers['authorization'];
        let memberNumber;
        // memberNumber에 접근하는 방법
        await jwt.jwtVerify(token).then(decoded => {
            memberNumber = decoded.decoded.payload.memberNumber;
        })

        let { affectedRows } = await repository.writeComment(commentContent, memberNumber, boardNumber);

        if (affectedRows > 0) {
            res.status(StatusCodes.CREATED).send({
                code: StatusCodes.CREATED,
                httpStatus: ReasonPhrases.CREATED,
                message: "정상적으로 댓글이 등록되었습니다."
            });
        } else {
            throw new Error('댓글 등록 중 오류가 발생했습니다');
        }
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
            code: StatusCodes.INTERNAL_SERVER_ERROR,
            httpStatus: ReasonPhrases.INTERNAL_SERVER_ERROR,
            message: error.message
        });
    }
}
/**
 * 댓글 수정
 */
exports.updateComment = async (req, res) => {
    try {
        let {commentContent, boardNumber} = req.body;
        // 댓글이 없다면
        if (!commentContent) {
            return res.status(StatusCodes.BAD_REQUEST).send({message: "댓글을 다시 작성해주세요."});
        }

        let { commentNumber } = req.params;
        let token = req.headers['authorization'];
        let memberNumber;

        // memberNumber에 접근하는 방법
        await jwt.jwtVerify(token).then(decoded => {
            memberNumber = decoded.decoded.payload.memberNumber;
        })

        let { changedRows } = await repository.updateComment(commentContent, commentNumber, memberNumber, boardNumber);

        if (changedRows === 1) {
            res.status(StatusCodes.OK).send({
                code: StatusCodes.CREATED,
                httpStatus: ReasonPhrases.CREATED,
                message: `댓글이 ${commentContent}로 수정되었습니다.`
            });
        } else {
            throw new Error('댓글 수정 중 오류가 발생했습니다')}
    } catch (error) {
        console.error(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
            code: StatusCodes.INTERNAL_SERVER_ERROR,
            httpStatus: ReasonPhrases.INTERNAL_SERVER_ERROR,
            message: error.message
        });
    }
}

/**
 * 댓글 삭제
 */
exports.deleteComment = async (req, res) => {
    try {
        let { commentNumber } = req.params;
        let token = req.headers['authorization'];
        let memberNumber;

        // memberNumber에 접근하는 방법
        await jwt.jwtVerify(token).then(decoded => {
            memberNumber = decoded.decoded.payload.memberNumber;
        })
        let { affectedRows } = await repository.deleteComment(commentNumber, memberNumber);

        // 댓글 삭제 성공
        if (affectedRows > 0) {
            res.status(StatusCodes.CREATED)
            res.send({
                code: StatusCodes.CREATED,
                httpStatus: ReasonPhrases.CREATED,
                message: "정상적으로 댓글이 삭제되었습니다."})
        }
        // 댓글 삭제 실패
        else {
            throw new Error("댓글 삭제 중 오류가 발생했습니다")}
    } catch (error) {
        console.error(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
            code: StatusCodes.INTERNAL_SERVER_ERROR,
            httpStatus: ReasonPhrases.INTERNAL_SERVER_ERROR,
            message: error.message
        });
    }
}