const DiscussionModel = require("../model/discussion.model")
const {param, validationResult} = require("express-validator");
const express = require("express");
const UserModel = require("../model/user.model");
const router = express.Router();

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
 * Find discussion
 */

router.get('/', async (req, res) => {
    const discussions = await DiscussionModel.find()
    res.send(discussions)
})

/**
 * Display discussions
 */

/**
 *  Delete discussion
 */

/**
 * Add members to the discussion
 */

router.put('/add/:id/:user_id',
    param('id')
        .notEmpty()
        .withMessage('id is required')
        .isMongoId()
        .withMessage('id needs to be a mongodb id'),
    param('user_id')
        .notEmpty()
        .withMessage('id is required')
        .isMongoId()
        .withMessage('id needs to be a mongodb id'),
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
            res.status(404).send({message: 'user not found'})
        }
        const discussion = await DiscussionModel.findOne({_id: req.params.id})
        if(!discussion){
            res.status(404).send({message: 'discussion not found'})
        }
        discussion.members.push(user)
        discussion.save()
        res.send({discussion})
})

module.exports = router