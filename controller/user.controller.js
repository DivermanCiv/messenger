const express = require('express')
const UserModel = require("../model/user.model");
const {param, validationResult} = require("express-validator");
const router = express.Router()
const i18n = require('../i18n.config')
const myHelper = require('../helpers/helper')


/**
 * @namespace userController
 */

/**
 * Find users by
 * @memberof userController
 */
router.get('/', myHelper.isUserLogged, async (req, res) => {
  const users = await UserModel.find()
  res.send(users)
})

/**
 * Find the current user
 * @memberof userController
 */
router.get('/me', myHelper.isUserLogged, async (req, res) => {
  const user = await UserModel.findOne({_id: req.user._id})
  if (!user) {
    return res.status(404).send({message: i18n.t('user not found')})
  }
  res.send({user: user})
})

/**
 * Find by id
 * @memberof userController
 */
router.get('/:id',
  param('id')
    .notEmpty()
    .withMessage(i18n.t('id is required'))
    .isMongoId()
    .withMessage(i18n.t('id needs to be a mongodb id')),
    myHelper.isUserLogged,
  (req, res, next) => {
  const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({errors: errors.array()});
    }
    next()
  },
  async (req, res) => {
    const user = await UserModel.findOne({_id: req.params.id})
    if (!user) {
      res.status(404).send({message: i18n.t('user not found')})
    }
    res.send({user})
  })

/**
 * Create a user
 * @memberof userController
 */
router.post('/', async (req, res) => {
  try {
    let user = new UserModel(req.body)
    user = await user.save()
    res.status(201).send({user: user})
  } catch (e) {
    res.status(400).send(e)
  }
})

module.exports = router