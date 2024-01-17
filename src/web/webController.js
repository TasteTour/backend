exports.home = (req,res) => {
    res.send("Hello World!");
}

exports.page = (req,res) => {
    const page = req.params.page;
    let content
    switch (page) {
        case 'terms':
            content = "이용 약관";
            break;
        case 'policy':
            content = "개인정보 처리방침";
            break;
    }

    // res.send(content)
    // key : value 같으면 지워도 됨
    // res.rendoer('page.hbs', {content}) 
    res.render('page.hbs', {content : content}); // [hbs] 파일에서 <h1>{{content}}</h1> 로 출력 가능함
}

exports.sitemap = (req,res) => {
    res.send("sitemap");
}