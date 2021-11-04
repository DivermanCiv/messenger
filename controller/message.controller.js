const express = require('express')
const MessageModel = require("../model/message.model");
const {param, validationResult} = require("express-validator");
const router = express.Router()

/**
 * Create new message
 */

router.post('/')