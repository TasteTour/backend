const repository = require('./boardRepository')
const crypto = require('crypto')
const { StatusCodes, ReasonPhrases } = require('http-status-codes');
const jwt = require("../user/jwt");

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
    let boardNumber = req.params['boardNumber'];
    let token = req.headers['authorization'];
    let memberNumber;

    // memberNumber에 접근하는 방법
    await jwt.jwtVerify(token).then(decoded => {
        memberNumber = decoded.decoded.payload.memberNumber;
    })

    let {changedRows} = await repository.updateBoard(boardTitle, boardStar, boardCategory, boardStoreLocation, boardContent, boardNumber, memberNumber);


    // DB에 잘 등록되었다면
    if(changedRows === 1){
        res.status(StatusCodes.OK)
        res.send({ code: StatusCodes.OK, httpStatus: ReasonPhrases.OK, message: `${boardTitle} 글이 수정되었습니다.`})
    }
    else{
        res.status(StatusCodes.NOT_FOUND)
        res.send({ code: StatusCodes.NOT_FOUND, httpStatus: ReasonPhrases.NOT_FOUND, message: "변경된 내용이 없습니다."})
    }
}

exports.writeBoard = async (req, res) => {
    let { boardTitle, boardStar, boardCategory, boardStoreLocation, boardContent } = req.body
    let token = req.headers['authorization'];
    let memberNumber;

    // memberNumber에 접근하는 방법
    await jwt.jwtVerify(token).then(decoded => {
        memberNumber = decoded.decoded.payload.memberNumber;
    })

    let { affectedRows } = await repository.writeBoard(boardTitle, boardStar, boardCategory, boardStoreLocation, boardContent, memberNumber);

    if (affectedRows > 0){
        res.status(StatusCodes.CREATED)
        res.send({ code: StatusCodes.CREATED, httpStatus: ReasonPhrases.CREATED, message: "정상적으로 글이 등록되었습니다."})
    }
    else{
        res.status(StatusCodes.INTERNAL_SERVER_ERROR)
        res.send({ code: StatusCodes.INTERNAL_SERVER_ERROR, httpStatus: ReasonPhrases.INTERNAL_SERVER_ERROR, message: "글 등록 중 오류가 발생했습니다"})
    }

}