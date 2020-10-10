const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')

const secretKey = process.env.SECRET_KEY
const UserSchemaData = require('../Models/signupModel')


module.exports.requireLogin = async (req, res, next) => {
   const {authorization} = req.headers
   if(!authorization){
      return res.status(401).send({error:"You are not sing in user"})
   }
   const token = authorization.replace("Bearer ", "")
   jwt.verify(token, secretKey, async (error, payload) => {
      if (error) {
         return res.status(401).send({error:"You are not sing in user"})
      }
      const {_id} = payload
      const verifyUser = await UserSchemaData.findById(_id)
      req.user = verifyUser
      next()
   })
}