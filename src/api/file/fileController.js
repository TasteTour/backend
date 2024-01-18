const repository = require('./repository')
const {StatusCodes, ReasonPhrases} = require("http-status-codes");

// 파일 업로드를 위한 함수
exports.upload = async (req, res) => {
    //파일들이 Array형태로 저장 중.
    const files = req.files;
    let boardNumber = req.param.boardNumber;
    let results = 0;

    // 파일들 하나하나 DB에 이름으로 저장함.
    files.forEach(file => {
        const { affectedRows } = repository.create(files.name, files.path, files.size, boardNumber);
        results += affectedRows;
    })
    
    if(files.length == results){
        res.status(StatusCodes.CREATED)
        res.send({ code: StatusCodes.CREATED, httpStatus: ReasonPhrases.CREATED, message: "정상적으로 이미지가 등록되었습니다."})
    }
    else{
        res.status(StatusCodes.INTERNAL_SERVER_ERROR)
        res.send({ code: StatusCodes.INTERNAL_SERVER_ERROR, httpStatus: ReasonPhrases.INTERNAL_SERVER_ERROR, message: "이미지 등록 중 오류가 발생했습니다"})
    }

}

// 다운로드 위한 함수
exports.download = async (req, res) => {

}