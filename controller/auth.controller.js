const express = require('express')
const {body, validationResult} = require("express-validator");
const UserModel = require("../model/user.model");
const router = express.Router()
const jsonwebtoken = require('jsonwebtoken');
const {secret} = require('../config')

router.post('/login',
  body('username')
    .notEmpty()
    .withMessage('username is required'),
  body('password')
    .notEmpty()
    .withMessage('password is required'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({errors: errors.array()});
    }
    next()
  },
  async (req, res) => {
    const user = await UserModel.findOne({username: req.body.username})
    if (!user) {
      return res.status(404).send({message: 'user not found'})
    }
    const samePassword = await user.comparePassword(req.body.password)
    if (!samePassword) {
      return res.status(400).send({message: 'password invalid'})
    }
    const token = jsonwebtoken.sign({
      _id: user._id
    }, secret);

    res.cookie('jwt', token, {maxAge: 900000})
    res.send({
      user: user,
      token: token
    })
  })

router.delete('/logout', async (req, res) => {
  res.cookie('jwt', '', {maxAge: 0})
  res.send({})
})

module.exports = router