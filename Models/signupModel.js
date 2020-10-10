const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema.Types


const signupSchema = new mongoose.Schema({
   name:{
      type:String,
      required:true
   },
   email:{
      type:String,
      required:true,
      trim:true,
   },
   dateOfBirth:{
      type:String,
      required:true
   },
   password:{
      type:String,
      required:true,
   },
   profile:{type:String},
   allPhoto:[{type:String}],
   followers:[{type:ObjectId, ref:"UserSchemaData"}],
   following:[{type:ObjectId, ref:"UserSchemaData"}]
})

const UserSchemaData = mongoose.model("UserSchemaData", signupSchema)
module.exports = UserSchemaData