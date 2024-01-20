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

// 이미지 다운로드 위한 함수
exports.download = async (req, res) => {
    try {
        let fileNumber = req.params.fileNumber;

        // DB에서 파일 불러오기
        let image = await repository.show(fileNumber);

        // 이미지가 있는 경우
        if (image.length > 0) {
            // 이미지의 경로 가져오기
            const imagePath = image[0].imagePath;

            res.status(StatusCodes.OK)
            res.send({
                code: StatusCodes.OK,
                httpStatus: ReasonPhrases.OK,
                message: "정상적으로 이미지가 다운로드 되었습니다.",
                imagePath: imagePath})
        // 이미지가 없는 경우
        } else {
            res.status(StatusCodes.NOT_FOUND)
            res.send({
                code: StatusCodes.NOT_FOUND,
                httpStatus: ReasonPhrases.NOT_FOUND,
                message: "이미지 다운로드 중 오류가 발생했습니다"})
        }

    // 서버 오류 발생
    } catch (error) {
        console.error("이미지 다운로드 중 오류 발생", error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR)
            .send({
                code: StatusCodes.INTERNAL_SERVER_ERROR,
                httpStatus: ReasonPhrases.INTERNAL_SERVER_ERROR,
                message: "이미지 다운로드 중 오류 발생했습니다."});
    }
}