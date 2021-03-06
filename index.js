require('dotenv').config();
const express = require('express')
const app = express()
const port = process.env.PORT || 3000
const UserController = require('./controller/user.controller')
const AuthController = require('./controller/auth.controller')
const DiscussionController = require('./controller/discussion.controller')
const MessageController = require('./controller/message.controller')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const jsonwebtoken = require("jsonwebtoken");
const {secret} = require('./config')
const i18n = require("./i18n.config");
const myHelper = require('./helpers/helper')


app.use(bodyParser.json())
app.use(cookieParser())
app.use((req, res, next) => {
  if (!req.cookies.jwt) {
    return next()
  }
  req.user = jsonwebtoken.verify(req.cookies.jwt, secret)
  next()
})


app.use('/api/auth', AuthController)
app.use('/api/users', UserController)

//Check if user is logged on before accessing to /discussions and /messages routes
app.use((req, res, next)=>{
  myHelper.isUserLogged(req, res, next)
})

app.use('/api/discussions', DiscussionController)
app.use('/api/messages', MessageController)

app.listen(port, () => {
  console.log(`Messenger listening at http://localhost:${port}`)
})