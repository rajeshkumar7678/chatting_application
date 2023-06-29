const express=require("express")
const { usermodel } = require("../models/usermodel")
const bcrypt=require("bcrypt")
const nodemailer=require("nodemailer")
const jwt=require("jsonwebtoken")
const { client } = require("../redis")
const path=require("path")

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
            return res.status(400).send({"msg":"already user"})
        }
        let hesspass=bcrypt.hashSync(password,7)
        let newuser=new usermodel({name,email,password:hesspass})
        await newuser.save()
        sendingmail(name,email,newuser._id)
        res.status(200).send({"msg":"register successfull please verify the mail to login"})
    } catch (error) {
        res.send(error.massage)
    }
})

let sendingmail=async(Name,Email,userid)=>{
    try {
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'mr.rajeshkumar7678@gmail.com',
                pass: process.env.googlepassword
            }
        });

        let mailOptions = {
            from: 'mr.rajeshkumar7678@gmail.com',
            to: Email,
            subject: 'For verifecation mail',
            html:`<p>hi ${Name} <br> please click here to <a href="http://localhost:7678/user/verify?id=${userid}">verify</a>  your mail. </p>`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
                
            } else {
                console.log('Email sent: ' + info.response);
               
            }
        });
    } catch (error) {
        console.log(error)
    }

}
//verify mail=============================================
userroute.get("/verify",async(req,res)=>{
    try {
        let {id}=req.query
        let userverify=await usermodel.findOne({_id:id})

        if(!userverify){
            return res.status(400).send({"msg":"not valid email"})
        }

        userverify.isverified=true
        await userverify.save()
        res.status(200).send({"msg":"mail verified successfull"})

    } catch (error) {
        console.log(error)
    } 
})
//login route================================================
userroute.post("/login",async (req,res)=>{
    try {
        let {email,password}=req.body
        let user=await usermodel.findOne({email})
        if(!user){
            return res.status(400).send({"msg":"please register first"})
        }
        let hesppass=bcrypt.compareSync(password,user.password)
        console.log(hesppass)
        if(!hesppass){
            return res.status(400).send({"msg":"password incorrect"})
        }
        if(user.isverified==false){
            return res.status(400).send({"msg":"verify your mail first"})
        }
        let token=jwt.sign({id:user._id,name:user.name},"rajesh",{expiresIn:"5hr"})
        let refreshtoken=jwt.sign({id:user._id,name:user.name},"rajesh",{expiresIn:"5hr"})

        client .set("token",token,'EX', 3600)
        client.set("refreshtoken",refreshtoken,'EX', 3600)
        res.redirect(`/user/chat/?id=${user.name}`) 
        // res.status(200).send({"msg":"login successful","userdetails":user})
    } catch (error) {
        console.log(error)
    }
})

userroute.get("/getuser",async(req,res)=>{
    try {
        let{id}=req.query
        let user=await usermodel.findOne({_id:id})
        res.send({"user":user})
    } catch (error) {
        res.send(error)
    }
})

userroute.get("/chat",async(req,res)=>{
    let {id}=req.query
    console.log(id)
    try {
        res.sendFile(path.join(__dirname,"../view/chat.html"))       
    } catch (error) {
        console.log(error)
        res.send(error)
    }
})




module.exports={
    userroute
}