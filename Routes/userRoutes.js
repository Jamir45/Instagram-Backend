const express = require('express')
const router = express.Router()


// // User Registration Model from signupModel.js
const PostSchemaData = require('../Models/postModel')

// Our Own Middleware
const {requireLogin} = require('../Middleware/requireLogin')

const UserSchemaData = require('../Models/signupModel')


// Get Single user
router.get('/user-profile/:userId', requireLogin, async(req, res) => {
   const id = req.params.userId
   try {
      const user = await UserSchemaData.findOne({_id:id})
      const post = await PostSchemaData.find({postedBy:id})
      .populate("postedBy", '_id name')
      res.status(200).send({user, post})
   } catch (error) {
      res.status(400).send(error.message)
   }
})

// Upload Profile Photo
router.put('/upload-profile-photo', requireLogin, async(req, res)=> {
   const updatedUser = await UserSchemaData.findByIdAndUpdate(req.user._id, {
      profile:req.body.profilePhoto,
      $push:{allPhoto:req.body.profilePhoto}
   }, {
      new:true
   })
   res.send(updatedUser)
})

// Follow and Un-Follow
router.put('/follow', requireLogin, (req, res) => {
   UserSchemaData.findByIdAndUpdate(req.body.followUserId, {
         $push:{followers:req.user._id}
      },{
         new:true
      },(error, result) => {
      if (error) {
         return res.status(400).send({error})
      }
      UserSchemaData.findByIdAndUpdate(req.user._id, {
            $push:{following:req.body.followUserId}
         },{
            new:true
         })
         .then(result=> {
            return res.send(result)
         })
         .catch(error => {
            return res.status(400).send({error})
         })
      }
   )
})

// UnFollow and Un-Follow
router.put('/un-follow', requireLogin, (req, res) => {
   UserSchemaData.findByIdAndUpdate(req.body.followUserId, {
         $pull:{followers:req.user._id}
      },{
         new:true
      },(error, result) => {
      if (error) {
         return res.status(400).send({error})
      }
      UserSchemaData.findByIdAndUpdate(req.user._id, {
            $pull:{following:req.body.followUserId}
         },{
            new:true
         })
         .then(result=> {
            return res.send(result)
         })
         .catch(error => {
            return res.status(400).send({error})
         })
      }
   )
})

// // Get User Profile
// router.get('/user-profile', requireLogin, async(req, res) => {
//    const profile = await UserSchemaData.find({_id:req.body.userId})
//    res.send(profile[0])
// })



module.exports = router