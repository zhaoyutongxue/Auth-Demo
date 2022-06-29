// this is the schema to save username and the hashed password in the database. 

const { string } = require('joi')
const mongoose = require('mongoose')
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        require: [true, 'Username is required!']
    },
    password: {
        type: String,
        require: [true, 'password is required!']
    }
})

const User = mongoose.model('User', userSchema)
module.exports = User 