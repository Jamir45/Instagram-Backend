const express = require('express')
const router = express.Router()

// // User Registration Model from signupModel.js
const PostSchemaData = require('../Models/postModel')

// Our Own Middleware
const {requireLogin} = require('../Middleware/requireLogin')

const UserSchemaData = require('../Models/signupModel')


// Post request
router.post('/create-post', requireLogin, async(req, res) => {
   const {title, postBody, image} = req.body
   try {
      req.user.password = undefined
      const post = new PostSchemaData({
         title, 
         postBody,
         image,
         postedBy:req.user
      })
      await post.save()
      console.log(post)
      res.send({success:"Post is successfully posted"})
   } catch (error) {
      res.status(400).send(error.message)
   }
})

// Get All post
router.get('/all-post', requireLogin, async (req, res) => {
   try {
      const allPost = await PostSchemaData.find()
      .populate("postedBy", "_id name email")
      .populate("comments.commentedBy", "_id name")
      res.send(allPost)
   } catch (error) {
      res.status(400).send(error.message)
   }
})

// Get Specific user post
router.get('/my-post', requireLogin, async (req, res) => {
   try {
      const myPost = await PostSchemaData.find({postedBy:req.user._id})
      res.send(myPost)
   } catch (error) {
      res.status(400).send(error.message)
   }
})

// Like on the post 
router.put('/like', requireLogin, (req, res) => {
   PostSchemaData.findByIdAndUpdate(req.body.postId, {
      $push:{likes:req.user._id}
   },{
      new:true
   }
   )
   .populate("postedBy", "_id name email")
   .populate("comments.commentedBy", "_id name")
   .exec((err, result) => {
      if (err) {
         return res.status(400).send({error:err})
      }else{
         res.send(result)
      }
   })
})

// Unlike on the post 
router.put('/unlike', requireLogin, (req, res) => {
   PostSchemaData.findByIdAndUpdate(req.body.postId, {
      $pull:{likes:req.user._id}
   },{
      new:true
   }
   )
   .populate("postedBy", "_id name email")
   .populate("comments.commentedBy", "_id name")
   .exec((err, result) => {
      if (err) {
         return res.status(400).send({error:err})
      }else{
         res.send(result)
      }
   })
})

// Male comments on the post 
router.put('/comment', requireLogin, (req, res) => {
   const comment = {
      text:req.body.comment,
      commentedBy:req.user._id
   }
   PostSchemaData.findByIdAndUpdate(req.body.postId, {
      $push:{comments:comment}
   },{
      new:true
   }
   )
   .populate("postedBy", "_id name email")
   .populate("comments.commentedBy", "_id name")
   .exec((err, result) => {
      if (err) {
         return res.status(400).send({error:err})
      }else{
         res.send(result)
      }
   })
})

// Delete Post 
router.delete('/delete-post/:postId', requireLogin, async (req, res) => {
   const post = await PostSchemaData.findOne({_id:req.params.postId})
   try {
      if (post.postedBy._id.toString() === req.user._id.toString()) {
         const deletedPost = await post.remove()
         res.send(deletedPost)
      }else{
         res.status(400).send({error:"Something is wrong"})
      }
   } catch (error) {
      res.status(400).send(error.message)
   }
})

// To Get All the post
router.get('/following-user-post/:userId', requireLogin, async (req, res) => {
   try {
      const posts = await PostSchemaData.filter({postedBy:req.params.userId})
      // .populate("postedBy", "_id name email")
      // .populate("comments.commentedBy", "_id name")
      res.send(posts)
   } catch (error) {
      res.status(500).send(error.message)
   }
})



module.exports = router