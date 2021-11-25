const DiscussionModel = require("../model/discussion.model")
const {param, validationResult} = require("express-validator")
const express = require("express")
const UserModel = require("../model/user.model")
const router = express.Router()
const i18n = require('../i18n.config')
const {maxDiscussionsDisplayed} = require("../config")
const myHelper = require('../helpers/helper')

/** Express router providing discussion related routes
 * @namespace discussionController
 */

/**
 * Create a discussion
 * @name post/
 * @function
 * @memberof discussionController
 */
router.post('/',async (req, res) => {
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
 * @name get/
 * @function
 * @memberof discussionController
 */
router.get('/', async (req, res) => {
    if (req.body.page === 0) {
        req.body.page = 1
    }
    let page_number = req.body.page
    let offset = maxDiscussionsDisplayed * page_number - maxDiscussionsDisplayed
    const discussions = await DiscussionModel
        .find({members : req.user._id})
        .skip(offset)
        .limit(maxDiscussionsDisplayed)
        .sort({'createdAt': 1})
    if (discussions.length === 0){
        return res.status(404).send({message: i18n.t('No discussion to display')})
    }
    res.send(discussions)
})

/**
 *  Delete discussion
 *  @name delete/
 *  @function
 *  @memberof discussionController
 */
router.delete('/', async(req, res) => {
    const discussion = await DiscussionModel.findOne({_id: req.body.id})
    if(req.user._id !== discussion.author._id.valueOf()){
        return res.status(401).send({message: i18n.t('unauthorized')})
    } else {
        await DiscussionModel.findOneAndDelete({_id: req.body.id})
        res.send({})
    }
})

/**
 * Add members to the discussion
 * @memberof discussionController
 * @name put/:id/:user_id
 * @function
 * @param {string} id - The mongodb id of the targeted discussion
 * @param {string} user_id - the mongodb id of the targeted user
 */
router.put('/:id/:user_id',
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
            return res.status(404).send({message: i18n.t('user not found')})
        }
        const discussion = await DiscussionModel.findOne({_id: req.params.id})
        if(!discussion){
            return res.status(404).send({message: i18n.t('discussion not found')})
        } else if (!discussion.members.includes(req.user._id)){
            return res.status(401).send({message: i18n.t('unauthorized')})
        } else if (discussion.members.includes(user._id)){
            return res.status(400).send({message: i18n.t('user already in discussion')})
        } else {
            discussion.members.push(user)
            discussion.save()
            return res.send({discussion})
        }

})

module.exports = router