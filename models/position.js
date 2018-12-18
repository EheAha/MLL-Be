const mongoose = require('../utils/database')

//创建Schema（架构），创建集合
const positionSchema = new mongoose.Schema({
    id:String,
    goods_img:String,
    goods_name:String,
    show_price: String,
    variable_sales_amount: String,
    createDate: String
})

const PositionModel = mongoose.model('positions',positionSchema)

//取到全部信息
const listall = ({
    start,
    count,
    keywords
})=>{
    let reg = new RegExp(keywords,'gi')
    return PositionModel
    .find({
        $or:[
            {goods_name:reg},
            {show_price:reg},
            {variable_sales_amount:reg}
        ]
    })
    .sort({
        _id:-1
    })
    .skip(start)
    .limit(count)
    .then((result)=>{
        return result
    })
    //catch表示find操作出错了，空数据不代表出错
    .catch((err)=>{
        return false
    })
}


const total = ({
    keywords
})=> {
    let reg = new RegExp(keywords,'gi')
    return PositionModel
    .find({
        $or:[
            {companyName:reg},
            {positionName:reg},
            {variable_sales_amount:reg}
        ]
    })
    .sort({
        _id:-1
    })
    .then((result)=>{
        return result
    })
    .catch((err)=>{
        return false
    })
    
}

//保存全部职位信息
const save = (data)=>{
    return new PositionModel(data)
    .save()  //save()异步保存方法，从mongo检索文档，然后发出更新命令
    .then((result)=>{
        return result
    })
}

//删除信息(在集合positions上操作)
const remove = (id)=>{
    return PositionModel
    .findByIdAndDelete(id)
    .then((result)=>{
        return result
    })
}

//显示一条信息
const listone = (id)=>{
    return PositionModel
    .findById(id)
    .then((result)=>{
        return result
    })
}

//更新
const update = ({
    id,
    data
})=>{
    return PositionModel
    .findByIdAndUpdate(id,data)
    .then((result)=>{
        return result
    })
}

module.exports = {
    listall,
    total,
    save,
    remove,
    listone,
    update
}