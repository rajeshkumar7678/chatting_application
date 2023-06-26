const express=require("express")
const { usermodel } = require("../models/usermodel")
const bcrypt=require("bcrypt")

const userroute=express.Router()

userroute.get("/",(req,res)=>{
    res.status(200).send("user route")
})

//register route=============================================
userroute.post("/register",async(req,res)=>{
    try {
        const {email,password,name}=req.body
        let user=await usermodel.findOne({email})
        if(user){
            return res.status(200).send("already user")
        }
        let hesspass=bcrypt.hashSync(password,7)
        let newuser=new usermodel({name,email,password:hesspass})
        await newuser.save()
        sendingmail(name,email,newuser._id)
        res.send("register successfull",newuser)
    } catch (error) {
        res.send(error.massage)
    }
})

function sendingmail(name,email,id){
    console.log(name,email,id)
}






module.exports={
    userroute
}