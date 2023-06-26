const express=require("express")
const { connect } = require("./db")
const { userroute } = require("./routes/userroute")
require("dotenv").config()
const app=express()
let port=process.env.port||7678
app.use(express.json())


app.get("/",(req,res)=>{
    res.send("homr page")
})

app.use("/user",userroute)





app.listen(port,async()=>{
    try {
        await connect
        console.log("db connected")
    } catch (error) {
        console.Log(error)
    }
    console.log("server is running")
})

