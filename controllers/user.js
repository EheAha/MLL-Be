const userModel = require('../models/user')

const bcrypt = require('bcrypt')

const _docrypt = (password)=>{
   return new Promise((resolve)=>{
    bcrypt.genSalt(10, function(err, salt) {
        //将密码加密
        bcrypt.hash(password, salt, function(err, hash) {
            resolve(hash)
        });
    });
   })
}

//注册
const signup =async (req,res,next)=>{
    res.header('Content-Type','application/json;charset=utf8')
    let {
        username,
        password
    } = req.body
    
    //判断用户名是否已经被注册过
    let isSigned = !!(await userModel.findone({username}))

    if(isSigned){
        res.render('user',{
            ret:true,
            data:JSON.stringify({
                msg:'该用户名存在'
            })
        })
    }else{
        let result = await userModel.signup({
            username,
            password: await _docrypt(password)
        })
        if(!!result){
            res.render('user',{
                ret:true,
                data:JSON.stringify({
                    msg:"注册成功"
                })
            })
        }

    }

}

//登录
const signin =async (req,res,next)=>{
    res.header('Content-Type','application/json;charset=utf8')
    let {
        username,
        password
    } = req.body
    
    //根据用户名去数据库取密码与用户输入的密码进行对比
    let result = await userModel.findone({username})
    if(!!result){
        //密码是否相同
        let isPasswordCorrect = await _comparePwd(password, result.password)
        
        if(isPasswordCorrect && username==result.username){

            //session操作，引入express-session后就直接有了session对象
            req.session.username = result.username

            res.render('user',{
                ret:true,
                data:JSON.stringify({
                    username:result.username
                })
            })
        }else{
            res.render('user',{
                ret:false,
                data:JSON.stringify({
                    msg:"密码错误"
                })
            })
        }
    }else{
        res.render('user',{
            ret:false,
            data:JSON.stringify({
                msg:"用户名错误"
            })
        })
    }

}

const _comparePwd = (fromUser,fromDatabase)=>{
    return new Promise((resolve) => {
        //bcrypt提供的方法
        bcrypt.compare(fromUser, fromDatabase, (err, res) => {
          resolve(res)
        })
      })
}

const isSigned = (req,res,next)=>{
    res.header('Content-Type','application/json;charset=utf8')
    let username = req.session.username
    if(!!username){
        res.render('user',{
            ret:true,
            data:JSON.stringify({
                username:username
            })
        })
    }else{
        res.render('user',{
            ret:false,
            data:JSON.stringify({
                msg:'您没有权限'
            })
        })
    }
}

const signout = async (req,res,next)=>{
    res.header('Content-Type','application/json;charset=utf8')
    req.session.username = null
    res.render('user',{
        ret:true,
        data:JSON.stringify({
            msg:'退出成功'
        })
    })
}

module.exports={
    signup,
    signin,
    isSigned,
    signout
}