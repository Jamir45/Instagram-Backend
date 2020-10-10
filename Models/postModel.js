const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema.Types

const postSchema = new mongoose.Schema({
   title:{
      type:String,
      required:true
   },
   postBody:{
      type:String,
      required:true
   },
   image:{
      type:String
   },
   likes:[{
      type:ObjectId,
      ref:'UserSchemaData',
   }],
   comments:[{
      text:String,
      commentedBy:{
         type:ObjectId,
         ref:"UserSchemaData"
      }
   }],
   postedBy:{
      type:ObjectId,
      ref:'UserSchemaData'
   }
})

const PostSchemaData = mongoose.model('PostSchemaData', postSchema)
module.exports = PostSchemaData