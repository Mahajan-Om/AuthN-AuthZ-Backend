const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },

    email:{
        type:String,
        required:true,
        trim:true
    },

    password:{
        type:String,
        required:true,
    },

    role:{
        type:String,
        enum : ['Admin' , 'Student' , 'Visitor']  // enum de diya taki in teeno me se bs ek value select ho
    }


});

module.exports = mongoose.model("userdata" , userSchema);