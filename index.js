const express = require('express')
const app = express();
const mongoose = require('mongoose');
const User = require('./models/user')
const bcrypt = require('bcrypt');

app.set('view engine', 'ejs');
app.set('views', 'views')

const user = require('./models/user.js')

app.use(express.urlencoded({ extended: true }))

mongoose.connect('mongodb://localhost:27017/authDemo', {
    useNewUrlParser: true,
    // useCreateIndex:true, 
    useUnifiedTopology: true
})

const db = mongoose.connection;
db.on('error', console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("database connected")
})

// bcrypt async method:
const hashpassword = async (pw) => {
    const salt = await bcrypt.genSalt(saltRounds)
    const hash = await bcrypt.hash(pw, salt);
    console.log(salt)
    console.log(hash)
}
const login = async (pw, hashedPw) => {
    const result = await bcrypt.compare(pw, hashedPw);
    if (result) {
        console.log('success match! Logged you in! ')
    } else {
        console.log("incorrect!")
    }
}


app.get('/register', (req, res) => {
    res.render('register.ejs')
})

app.post('/register', async (req, res) => {
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(req.body.password, salt)
    req.body.password = hash;
    const user = new User(req.body)
    await user.save();
    res.send(req.body)
})

app.get('/login', (req, res) => {
    res.render('login.ejs')
})

app.post('/login', async (req, res) => {
    const { username, password } = req.body
    const user = await User.findOne({ username: username })
    const result = await bcrypt.compare(password, user.password)
    if (result) {
        res.send('successfully login!')
    } else {
        res.send('try again')
    }
})

app.get('/secret', (req, res) => {
    res.send('this is the secret! ')
})

app.listen(3000, () => {
    console.log('listening on port 3000  ')
})