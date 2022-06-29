const express = require('express')
const app = express();
const mongoose = require('mongoose');
const User = require('./models/user')
const bcrypt = require('bcrypt');
const session = require('express-session')

app.set('view engine', 'ejs');
app.set('views', 'views')

const user = require('./models/user.js')

app.use(express.urlencoded({ extended: true }))
app.use(session({ secret: 'notagoodsecret' }))


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
    req.session.user_id = user._id;
    res.redirect('/')
})

app.get('/login', (req, res) => {
    res.render('login.ejs')
})

app.get('/', (req, res) => {
    res.send('Home Page')
})

app.post('/login', async (req, res) => {
    const { username, password } = req.body
    const user = await User.findOne({ username: username })
    const result = await bcrypt.compare(password, user.password)
    if (result) {
        req.session.user_id = user._id;
        req.session.destroy();
        res.redirect('/secret')
    } else {
        res.redirect('/login')
    }
})

app.get('/secret', (req, res) => {
    if (!req.session.user_id) {
        res.redirect('/login')
    }
    res.render('secret.ejs')
})

app.post('/logout', (req, res) => {
    req.session.user_id = null;
    res.redirect('/login')
})

app.listen(3000, () => {
    console.log('listening on port 3000  ')
})