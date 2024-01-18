const repository = require('./boardRepository')
const crypto = require('crypto')
const { StatusCodes, ReasonPhrases } = require('http-status-codes');
const {jwtVerify} = require("../user/jwt");

/**
 * 최신순으로 글 조회하기
 * @apiNote DB 오류 발생 시 500 오류 발생
 * @apiNote 글은 Array 형태로 반환함
 * [
 *  {
 *      boardNumber: 2, ...
 *  },
 *  {
 *      boardNumber: 1, ...
 *  }
 * ]
 */
exports.readLatestBoards = async (req, res) => {

    let item = await repository.readLatestBoards();

    if(item == null){
        res.status(StatusCodes.INTERNAL_SERVER_ERROR)
        res.send({ code: StatusCodes.INTERNAL_SERVER_ERROR, httpStatus: ReasonPhrases.INTERNAL_SERVER_ERROR, message: "글 최신 순 조회 중에 오류가 발생했습니다"})
    }
    else{
        res.status(StatusCodes.OK)
        res.send({ code: StatusCodes.OK, httpStatus: ReasonPhrases.OK, message: "글 최신순 조회입니다.", data: item})
    }
}

/**
 * 인기순으로 글 조회하기
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
exports.readPopularBoards = async (req, res) => {
    let item = await repository.readPopularBoards();

    if(item == null){
        res.status(StatusCodes.INTERNAL_SERVER_ERROR)
        res.send({ code: StatusCodes.INTERNAL_SERVER_ERROR, httpStatus: ReasonPhrases.INTERNAL_SERVER_ERROR, message: "글 인기 순 조회 중에 오류가 발생했습니다"})
    }
    else{
        res.status(StatusCodes.OK)
        res.send({ code: StatusCodes.OK, httpStatus: ReasonPhrases.OK, message: "글 인기순 조회입니다.", data: item})
    }
}

exports.updateBoard = async (req, res) => {
    let { boardTitle, boardStar, boardCategory, boardStoreLocation, boardContent } = req.body
    let boardNumber = req.param.boardNumber;
    let token = req.header.Authorization;
    let memberNumber = await jwtVerify(token);

    let { changedRows } = await repository.updateBoard(boardTitle, boardStar, boardCategory, boardStoreLocation, boardContent, boardNumber, memberNumber);

    // DB에 잘 등록되었다면
    if(changedRows === 1){
        res.status(StatusCodes.CREATED)
        res.send({ code: StatusCodes.CREATED, httpStatus: ReasonPhrases.CREATED, message: `${boardTitle} 글이 수정되었습니다.`})
    }
    else{
        res.status(StatusCodes.UNAUTHORIZED)
        res.send({ code: StatusCodes.UNAUTHORIZED, httpStatus: ReasonPhrases.UNAUTHORIZED, message: "글 작성자만 글 수정이 가능합니다."})
    }
}