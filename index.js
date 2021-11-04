const express = require('express')
const app = express()
const port = 3000
const UserController = require('./controller/user.controller')
const AuthController = require('./controller/auth.controller')
const MessageController = require('./controller/message.controller')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const jsonwebtoken = require("jsonwebtoken");
const {secret} = require('./config')

app.use(bodyParser.json())
app.use(cookieParser())
app.use((req, res, next) => {
  if (!req.cookies.jwt) {
    return next()
  }
  req.user = jsonwebtoken.verify(req.cookies.jwt, secret)
  next()
})

app.use('/api/users', UserController)
app.use('/api/auth', AuthController)
app.use('/api/messages', MessageController)

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})