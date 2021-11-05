const express = require('express')
const MessageModel = require("../model/message.model");
const DiscussionModel = require('../model/discussion.model');
const {param, validationResult} = require("express-validator");
const router = express.Router()
const i18n = require('../i18n.config')
const UserModel = require("../model/user.model");

/**
 * Create new message
 */

router.post('/', async (req, res) => {
    try{
        let message = new MessageModel(req.body)
        message = await message.save()
        res.status(201).send({message: message})
    } catch(e) {
        res.status(400).send(e)
    }
})

/**
 * Edit or delete a message
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
        }
        message.content_history.push(message.content)

        if(req.body.action === "edit"){
            message.content = req.body.content
        } else if(req.body.action === "delete"){
            message.content = i18n.t('Message deleted')
        } else {
            return res.status(404).send({message: i18n.t('action doesn\'t exist')})
        }

        message.save()
        res.send({message})
    }
)

/**
 * Display messages
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
        const messages = await MessageModel.find({discussion: req.params.id})
        if (!messages) {
            res.status(404).send({message: i18n.t('message not found')})
        }
        res.send({messages})
    })

module.exports = router