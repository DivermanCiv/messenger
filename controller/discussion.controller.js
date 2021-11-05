const DiscussionModel = require("../model/discussion.model")
const {param, validationResult} = require("express-validator");
const express = require("express");
const UserModel = require("../model/user.model");
const router = express.Router();
const i18n = require('../i18n.config')

/**
 * Create a discussion
 */

router.post('/', async (req, res) => {
    try{
        let discussion = new DiscussionModel(req.body)
        discussion = await discussion.save()
        res.status(201).send({discussion: discussion})

    } catch(e){
        res.status(400).send(e)
        console.log(e)
    }

})

/**
 * Display discussions
 */

router.get('/', async (req, res) => {
    const discussions = await DiscussionModel.find()
    res.send(discussions)
})

/**
 *  Delete discussion
 */

/**
 * Add members to the discussion
 */

router.put('/add/:id/:user_id',
    param('id')
        .notEmpty()
        .withMessage(i18n.t('id is required'))
        .isMongoId()
        .withMessage(i18n.t('id needs to be a mongodb id')),
    param('user_id')
        .notEmpty()
        .withMessage(i18n.t('id is required'))
        .isMongoId()
        .withMessage(i18n.t('id needs to be a mongodb id')),
    (req, res, next) => {
    const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()});
        }
        next()
    },
    async (req, res) => {
        const user = await UserModel.findOne({_id: req.params.user_id})
        if (!user) {
            res.status(404).send({message: i18n.t('user not found')})
        }
        const discussion = await DiscussionModel.findOne({_id: req.params.id})
        if(!discussion){
            res.status(404).send({message: i18n.t('discussion not found')})
        }
        if (discussion.members.indexOf(user)){
            res.status(400).send({message: i18n.t('user already in discussion')})
        }
        discussion.members.push(user)
        discussion.save()
        res.send({discussion})
})

module.exports = router