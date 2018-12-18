const multer = require('multer')
const path = require('path')

var storage = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,path.resolve(__dirname,'../public/uploads'))
    },
    filename:function(req,file,cb){
        //图片的原始命名
        let originalName = file.originalname
        //图片扩展名
        let ext = originalName.substr(originalName.lastIndexOf('.'))
        //图片所存在的域名（即input框的name）
        let filename = file.fieldname + '-' + Date.now() + ext
        
        //将文件名绑定在req.body对象上，目的是在下一个中间件能够获取到此文件，并且入库
        req.body.goods_img = filename
        cb(null,filename)
    }
})

const fileFilter = (req,file,cb) => {
    //这个函数应该调用'cb'用boolean值来指示是否应接受该文件

    //文件类型满足条件
    // let type = ['image/jpeg', 'image/png', 'image/gif'].includes(file.mimetype)
    if(/^image/.test(file.mimetype)){
        //接受这个文件，使用true
        cb(null,true)
    }else{
         // 拒绝这个文件，使用`false`，像这样:
        cb(null,false)
        // 如果有问题，你可以总是这样发送一个错误:
        cb(new Error('文件类型必须是.jpg, .jpeg, .png, .gif'))
    }
}

const upload = multer({
    storage,
    fileFilter
}).single('goods_img')

const fileupload = (req,res,next)=>{
    upload(req,res,(err)=>{
        if(err){
            res.render('position',{
                ret:false,
                data:JSON.stringify({
                    msg: err.message
                  })
            })
        }else{
            next()
        }
    })
}

module.exports={
    fileupload
}