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
    let item = await repository.readPopularityBoards();

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
        res.status(StatusCodes.OK)
        res.send({ code: StatusCodes.OK, httpStatus: ReasonPhrases.OK, message: `${boardTitle} 글이 수정되었습니다.`})
    }
    else{
        res.status(StatusCodes.UNAUTHORIZED)
        res.send({ code: StatusCodes.UNAUTHORIZED, httpStatus: ReasonPhrases.UNAUTHORIZED, message: "글 작성자만 글 수정이 가능합니다."})
    }
}

exports.writeBoard = async (req, res) => {
    let { boardTitle, boardStar, boardCategory, boardStoreLocation, boardContent } = req.body
    let token = req.header.Authorization;
    let memberNumber = await jwtVerify(token); //token을 Decoding하면 회원 번호가 나옵니다

    let { affectedRows } = await repository.writeBoard(boardTitle, boardStar, boardCategory, boardStoreLocation, boardContent, boardNumber, memberNumber);

    if (affectedRows > 0){
        res.status(StatusCodes.CREATED)
        res.send({ code: StatusCodes.CREATED, httpStatus: ReasonPhrases.CREATED, message: "정상적으로 글이 등록되었습니다."})
    }
    else{
        res.status(StatusCodes.INTERNAL_SERVER_ERROR)
        res.send({ code: StatusCodes.INTERNAL_SERVER_ERROR, httpStatus: ReasonPhrases.INTERNAL_SERVER_ERROR, message: "글 등록 중 오류가 발생했습니다"})
    }

}

/**
 * 게시글 상호명 검색
 * ------------------------------ 문법 ------------------------------
 * exports : 외부 file에서 import 할 수 있게 허용한다는 의미
 * => : function 역할( (req, res) =>는 function(req, res)와 같은 의미 )
 * let : 변수 재선언 X, 재할당 O
 * const : 변수 재선언 X, 재할당 X
 */
exports.searchBoardByRestaurantName = async (req, res) => {
    let { boardTitle } = req.body
    let item; // 상호명 검색 결과

    try {
        // 게시글 상호명 검색
        item = await repository.getBoardByRestaurantName(boardTitle);

        // 상호명에 해당하는 게시글이 없다면
        if (!item || item.length === 0) {
            res.status(StatusCodes.NOT_FOUND)
                .send({ code: StatusCodes.NOT_FOUND, httpStatus: ReasonPhrases.NOT_FOUND, message: "해당 상호명에 대한 게시글이 없습니다." });
        } else {
            // 상호명에 해당하는 게시글이 있다면
            res.status(StatusCodes.OK)
                .send({ code: StatusCodes.OK, httpStatus: ReasonPhrases.OK, message: "글 인기순 조회입니다.", data: item });
        }
    // DB 쿼리 중 오류 발생시
    } catch (error) {
        console.error("DB 조회 중 오류 발생", error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR)
            .send({ code: StatusCodes.INTERNAL_SERVER_ERROR, httpStatus: ReasonPhrases.INTERNAL_SERVER_ERROR, message: "상호명 검색 중 서버에서 오류가 발생했습니다." });
    }
}

/**
 * 게시글 상세 조회
 */
exports.readBoardDetails = async (req, res) => {
    // HTTP 메시지 body에 있는 정보`
    let { boardNumber } = req.body
    // 게시글 ID로 조회한 게시글
    let board = await repository.getBoardDetails(boardNumber);

    // 게시글 상세 조회 실패
    if(board == null){
        res.status(StatusCodes.INTERNAL_SERVER_ERROR)
        res.send({ code: StatusCodes.INTERNAL_SERVER_ERROR, httpStatus: ReasonPhrases.INTERNAL_SERVER_ERROR, message: "글 최신 순 조회 중에 오류가 발생했습니다"})
    }
    // 게시글 상세 조회 성공
    else{
        res.status(StatusCodes.OK)
        res.send({ code: StatusCodes.OK, httpStatus: ReasonPhrases.OK, message: "글 최신순 조회입니다.", data: item})
    }
}

/**
 * 게시글 삭제
 */
exports.deleteBoard = async (req, res) => {
    let boardNumber = req.param.boardNumber;
    let token = req.header.Authorization;
    let memberNumber = await jwtVerify(token); //token을 Decoding하면 회원 번호가 나옵니다

    /**
     * {} : 구조 분해 문법
     * 반환값에서 { 내용 } 내용값만 추출해서 반환할 떄 {}로 감싼다.
     * 나는 repository에서 affectedRows 값만을 반환하므로 구조 분해할 필요 없다.
     */
    let affectedRows = await repository.deleteBoard(boardNumber, memberNumber);

    // 게시글 삭제 성공
    if (affectedRows > 0){
        res.status(StatusCodes.CREATED)
        res.send({ code: StatusCodes.CREATED, httpStatus: ReasonPhrases.CREATED, message: "정상적으로 글이 삭제되었습니다."})
    }
    // 게시글 삭제 실패
    else{
        res.status(StatusCodes.INTERNAL_SERVER_ERROR)
        res.send({ code: StatusCodes.INTERNAL_SERVER_ERROR, httpStatus: ReasonPhrases.INTERNAL_SERVER_ERROR, message: "글 삭제 중 오류가 발생했습니다"})
    }
}