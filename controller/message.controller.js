const express = require('express')
const MessageModel = require("../model/message.model");
const DiscussionModel = require("../model/discussion.model")
const {param, validationResult} = require("express-validator");
const router = express.Router()
const i18n = require('../i18n.config')
const {maxMessagesDisplayed} = require("../config")

/** Express router providing message related routes
 * @namespace messageController
 */

/**
 * Create new message
 * @name post/
 * @function
 * @memberof messageController
 */
router.post('/', async (req, res) => {
    let message = new MessageModel(req.body)
    let discussion = await DiscussionModel.findOne({_id: req.body.discussion})
    if (!discussion.members.includes(req.body.author)){
        return res.status(401).send({message: i18n.t('unauthorized')})
    } else {
        try{
            message = await message.save()
            res.status(201).send({message: message})
        } catch(e) {
            res.status(400).send(e)
        }
    }

})

/**
 * Edit or delete a message
 * @name put/edit/:id
 * @function
 * @memberof messageController
 * @param {string} id - The mongodb id of the targeted message
 */
router.put('/edit/:id',
    param('id')
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
        const message = await MessageModel.findOne({_id: req.params.id})
        if (!message) {
            res.status(404).send({message: i18n.t('message not found')})
        } else if (message.author._id !== req.user._id) {
            return res.status(401).send({message: i18n.t('unauthorized')})
        } else {
            message.content_history.push(message.content)
            if (req.body.action === "edit") {
                message.content = req.body.content
            } else if (req.body.action === "delete") {
                message.content = i18n.t('Message deleted')
            } else {
                return res.status(404).send({message: i18n.t('action doesn\'t exist')})
            }

            message.save()
            res.send({message})
        }
    }
)

/**
 * Display messages
 * @name get/:id
 * @function
 * @memberof messageController
 * @param {string} id - The mongodb id of the targeted discussion
 */
router.get('/:id',
    param('id')
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
        const discussion = await DiscussionModel.findOne({id: req.params.id})
        if (!discussion.members.includes(req.user._id)){
            return res.status(401).send({message: i18n.t('unauthorized')})
        } else {
            if (req.body.page === 0) {
                req.body.page = 1
            }
            let page_number = req.body.page
            let offset = maxMessagesDisplayed * page_number - maxMessagesDisplayed
            const messages = await MessageModel
                .find({discussion: req.params.id})
                .sort({'createdAt': 1})
                .skip(offset)
                .limit(maxMessagesDisplayed)
            if (messages.length === 0) {
                return res.status(404).send({message: i18n.t('No message to display')})
            }
            res.send({messages})
        }
    })

module.exports = router