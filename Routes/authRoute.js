const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
require('dotenv').config()
const {check, body, validationResult} = require('express-validator')

// User Registration Model from signupModel.js
const UserSchemaData = require('../Models/signupModel')
const { requireLogin } = require('../Middleware/requireLogin')


router.post('/user-registration', [
   check('name', 'Name is require').notEmpty(),
   check('email', 'Email is require').notEmpty(),
   check('email', 'Email is not valid').isEmail(),
   check('dateOfBirth', 'Date of birth is require').notEmpty(),
   check('password', 'Password is require').notEmpty(),
   check('password', 'Minimum password will be 6 character').isLength({min:6}),
   check('confirmPassword', 'Password is require').notEmpty(),
   check('confirmPassword').custom( (value, {req}) => {
      if (value !== req.body.password) {
         throw new Error("Confirm password is nt match")
      }else{
         return true
      }
   }),
], 
async(req, res) => {
   const {name, email, dateOfBirth, password} = req.body
   try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
         const error = errors.array().filter( obj => obj.msg)[0];
         return res.status(400).send({error:error.msg})
      }
      const usedEmail = await UserSchemaData.findOne({email:email})
      if (usedEmail) {
         return res.status(400).send({error:"This email is already used."})
      }
      const hashedPassword = await bcrypt.hash(password, 10)
      const user = new UserSchemaData({
         name,
         email, 
         dateOfBirth,
         password:hashedPassword
      })
      await user.save()
      res.send({success:"User Registration Successful."})
      console.log(user)
   } catch (error) {
      res.status(500).send(error)
   }
})


// Secret key
const secretKey = process.env.SECRET_KEY

// Login
router.post('/login', async(req, res) => {
   const {email, password} = req.body
   try {
      // Check email
      const savedUser = await UserSchemaData.findOne({email:email})
      if (!savedUser) {
         return res.status(400).send({error:"Email is not correct"})
      }
      // Check password
      const correctPassword = await bcrypt.compare(password, savedUser.password)
      if (!correctPassword) {
         return res.status(400).send({error:"Password is not correct"})
      }
      const token = await jwt.sign({_id:savedUser._id}, secretKey)
      const {_id, name, dateOfBirth} = savedUser 
      const Email = savedUser.email
      res.status(200).send({token, success:'You are Successfully Sign In', user:{_id, name, Email, dateOfBirth}})
   } catch (error) {
      res.status(500).send(error.message)
   }
})


// Get Profile
router.get('/profile', requireLogin, async(req, res) => {
   const profile = await UserSchemaData.find({_id:req.user._id})
   res.send(profile[0])
})


module.exports = router