const mongoose = require('../utils/database')

// 创建Schema，创建集合
const userSchema = new mongoose.Schema({
  username: String,
  password: String
})

const UserSchema = mongoose.model("users",userSchema)

const signup = (data)=>{
    let userSchema = new UserSchema(data)
    return userSchema
    .save()
    .then((result)=>{
        return result
    })
}

const findone = (condition)=>{
    return UserSchema
    .findOne(condition)
    .then((result)=>{
        return result
    })
}

module.exports={
    signup,
    findone
}