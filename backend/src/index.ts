import express from "express";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

mongoose.connect('mongodb+srv://franksedin:Testing%40123@cluster0.iduu6.mongodb.net/brainly')

const JWT_SECRET = 'Password'
const PORT = 3000;

const app = express();
app.use(express.json());


app.post('/api/v1/signup',(req,res)=>{


})

app.post('/api/v1/signin',(req,res)=>{

})

app.post('/api/v1/content',(req,res)=>{

})


app.get('/api/v1/content',(req,res)=>{

})


app.delete('/api/v1/content',(req,res)=>{

})

app.post('/api/v1/brain/share',(req,res)=>{

})



app.get('/api/v1/brain/:shareLink',(req,res)=>{
  
})


app.listen(PORT, () => {
  console.log(`App is listeing at ${PORT}`);
});
