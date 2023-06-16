const express = require('express')
const User = require('../models/User')
var bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const auth = require('../middleware/auth')
const { check, validationResult } = require('express-validator')
const dotenv = require('dotenv')
dotenv.config()
const router = express.Router()
// login user 
// @path /auth
// @type post
// @access public
router.post('/', [
    check('email', 'Please enter valid email').trim().isEmail(),
    check('password', 'Please enter minimum 6 characters').trim().isLength({ min: 6 }),
], async (req, res) => {
    const errors = validationResult(req)
    if (errors.array().length > 0) {
        return res.status(400).json({ errors: errors.array() })
    } else {
        try {
            const { email, password } = req.body
            const user = await User.findOne({ email })
            if (!user) {
                return res.json({
                    errors: [{ msg: "Invalid credentials" }]
                })

            }
            const passwordCheck = bcrypt.compareSync(password, user.password);
            if (!passwordCheck) {
                return res.json({
                    errors: [{ msg: "Invalid credentials" }]

                })
            }
            const payload = {
                user: {
                    id: user.id
                }
            }
            const token = await jwt.sign(payload, process.env.JWTSECRET, {})
            return res.json({ token })

        } catch (error) {
            return res.status(500).json({ errors: [{ msg: "Server error" }] })
        }
    }
})
// get user for loading
// @path /auth
// @type get
// @access private
router.get('/', auth, async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.user.id }).select('-password')
        res.send(user)
    } catch (error) {
        // return res.status(500).json({ errors: [{ msg: "Server error" }] })

    }
    // const user = await User.findOne({ _id: req.user.id }).select('-password')
    // res.send(user)
})
module.exports = router