const express = require('express')
const User = require('../models/User')
var bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
// const {jwtSecret}=require('../secretdata/secret')
const { check, validationResult } = require('express-validator')
const dotenv = require('dotenv')
dotenv.config()
const router = express.Router()
// @path /user
// @desc to register user to database
// @access public
router.post('/', [
    check('name', 'Please enter your name').trim().not().isEmpty(),
    check('email', 'Please enter valid email').trim().isEmail(),
    check('password', 'Please enter minimum 6 characters').trim().not().isEmpty().isLength({ min: 6 }),
    check('country', 'Please enter a valid country name').trim().not().isEmpty()


], async (req, res) => {
    console.log(req.body)
    const errors = validationResult(req)
    if (errors.array().length > 0) {
        return res.status(400).json({ errors: errors.array() })
    } else {
        try {
            const { name, email, password, country } = req.body
            const user = await User.findOne({ email: email }).exec();
            if (!user) {
                const user = new User({
                    name,
                    email,
                    password,
                    country
                })
                const salt = bcrypt.genSaltSync(10);
                const hashPassword = bcrypt.hashSync(password, salt);
                user.password = hashPassword
                await user.save()

                const payload = {
                    user: {
                        id: user.id
                    }
                }
                const token = jwt.sign(payload, process.env.JWTSECRET, {})
                return res.json({ token })

            } else {
                return res.status(400).json({ errors: [{ msg: "User already exists" }] })
            }
        } catch (error) {
            return res.status(400).json({ errors: [{ msg: "Something went wrong" }] })
        }

    }



})

module.exports = router