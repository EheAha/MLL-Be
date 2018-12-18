const positionModel = require('../models/position')
const moment = require('moment')

//socket.io 前后端通信
var server = require('http').createServer();
var io = require('socket.io')(server);

io.on('connection', function (socket) {
  socket.on('msg', (data) => {
    console.log(data)
  })
  socket.broadcast.emit('title', 'world')
});

server.listen(9002);

//显示单页数据
const listall = async (req,res,next)=>{
    res.header('Content-Type','application/json;charset=utf8')
    //接收前端url传来的pageNo和pageSize,当用户不传值时，默认为pageNo=1,pageSize=10
    let {
        pageNo = 1,
        pageSize = 10,
        keywords = ''
    } = req.query

    //位运算，强制转为数值型
    let list = await positionModel.listall({
        start:(~~pageNo-1) * ~~pageSize,
        count:~~pageSize,
        keywords
    })

    if(list){
        res.render('position',{
            ret:true,
            data:JSON.stringify({
                list,
                total:(await positionModel.total({
                    keywords
                })).length
            })
        })
    }else{
        res.render('position',{
            ret:false,
            data:JSON.stringify({
                msg:"获取数据失败，请和管理员联系~"
            })
        })
    }
}




//显示所有的数据
const total = async (req,res,next)=>{
    res.header('Content-Type','application/json;charset=utf8')
    
    let {keywords} = req.query
    //将.ejs模板读出来，把内容交给前端
    let listallData = await positionModel.total({keywords})
    if(listallData){
        res.render('position',{
            ret:true,
            data:JSON.stringify({
                //list,
                total:listallData.length
            })
        })
    }
}

//添加职位信息
const save = async (req,res,next)=>{
    res.header('Content-Type','application/json;charset=utf8')
    let result = await positionModel.save({
        ...req.body,
        createDate:moment().format('YYYY-MM-DD HH:mm')
    })
    if(!!result){
        res.render('position',{
            ret:true,
            data:JSON.stringify({
                msg:"数据保存成功"
            })
        })
    }else{
        res.render('position',{
            ret:false,
            data:JSON.stringify({
                msg:"数据保存失败"
            })
        })
    }
}

//删除信息
const remove = async (req,res,next)=>{
    res.header('Content-Type','application/json;charset=utf8')
    let {
        id
    } = req.body

    let result = await positionModel.remove(id)
    
    if(!!result){
        res.render('position',{
            ret:true,
            data:JSON.stringify({
                msg:'数据删除成功'
            })
        })
    }
    
}

//显示一条信息
const listone = async (req,res,next)=>{
    let id = req.body.id
    res.header('Content-Type','application/json;charset=utf8')
    let result = JSON.stringify(await positionModel.listone(id))

    if(result){
        res.render('position',{
            ret:true,
            data:result
        })
    }
}

//更新
const update = async (req,res,next)=>{
    res.header('Content-Type','application/json;charset=utf8')

    //如果goods_img不存在的话就根据id取出之前的图片名
    if(!!req.body.goods_img){
        //空操作
    }else{
        let result = await positionModel.listone(req.body.id)
        req.body.goods_img = result.goods_img
    }

    let result = await positionModel.update({
        id:req.body.id,
        data:{
            ...req.body
        }
    })
    if (!!result) {
        res.render('position', {
          ret: true,
          data: JSON.stringify({
            msg: '修改成功~'
          })
        })
      }
}

module.exports={
    listall,
    total,
    save,
    remove,
    listone,
    update
}