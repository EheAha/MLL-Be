//权限操作
const auth = (req,res,next)=>{
    res.header('Content-Type', 'application/json; charset=utf-8')
     // 此处username, 每个连接都会创建一个
    let username = req.session.username

    if(!!username){
        next()
    }else{
        res.render("user",{
            ret:false,
            data:JSON.stringify({
                msg:'对不起，您没有操作权限，请登录'
            })
        })
    }
}

module.exports = {
    auth
}