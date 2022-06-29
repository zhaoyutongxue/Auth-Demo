// this is the schema to save username and the hashed password in the database. 
const bcrypt = require('bcrypt')
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

userSchema.statics.findAndValidate = async function (username, password) {
    const foundUser = await this.findOne({ username })
    const isValid = await bcrypt.compare(password, foundUser.password)
    return isValid ? foundUser : false;
}


userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(this.password, salt)
    this.password = hash;
    next()
})

const User = mongoose.model('User', userSchema)
module.exports = User 