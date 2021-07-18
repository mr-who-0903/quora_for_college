const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// creating Schema
const userSchema = new mongoose.Schema({

    username:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
    },
    cpassword:{
        type:String,
        required:true,
    },
    date:{
        type:Date,
        default:Date.now
    },
    tokens:[
        {
            token:{
                type:String,
                required:true,
            }
        }
    ]
})

const questionSchema = new mongoose.Schema({

    question:{
        type:"String",
        required:true
    },
    date:{
        type:Date,
        default:Date.now
    },
    username:{
        type:"String",
        required:true
    },
    email:{
        type:"String",
        required:true
    },
    answers:[
        {
            username:{
                type:"String",
                required:true
            },
            email:{
                type:"String",
                required:true
            },
            answer:{
                type:"String",
                required:true
            },
            date:{
                type:"String",
                required:true
            }

        }
    ]



})

// password hashing     // this is a middleware function
userSchema.pre('save', async function (next){
    if(this.isModified('password')){
        this.password = await bcrypt.hash(this.password, 12);
        this.cpassword = await bcrypt.hash(this.cpassword, 12);
    }
    next();
})

// generating token
userSchema.methods.generateAuthToken = async function(){
    try{
        let generatedToken = jwt.sign({ _id: this._id}, process.env.SECRET_KEY);   // jwt.sign(payload, secret key)
        this.tokens = this.tokens.concat({ token: generatedToken });
        this.save();
        return generatedToken;
    }
    catch(err){
        console.log(err);
    }
}

// store answer to db
questionSchema.methods.addAnswer = async function(username, email, answer, date){

    try{
        this.answers = this.answers.concat({username, email, answer, date});
        this.save();
        return this.messages;
        
    }catch(err){
        console.log(err);
    }
}

// creating collection (collection means table)
const User = mongoose.model('user', userSchema);    
const Question = mongoose.model('question', questionSchema);

module.exports = {User, Question};