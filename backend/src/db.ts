import mongoose from "mongoose"

const Schema = mongoose.Schema
const ObjectId = Schema.ObjectId

const User = new Schema({
    username:{type:String, unique:true},
    password:String
})


const Content = new Schema({
    link:String,
    title:String,

    userId:ObjectId
})

const Tags = new Schema({
    title:String
})

const Link = new Schema({
    
})