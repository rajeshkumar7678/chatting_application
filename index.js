const express=require("express")
const { connect } = require("./db")
const { userroute } = require("./routes/userroute")
const {socket}=require("socket.io")
const cors=require("cors")
require("dotenv").config()
const app=express()
const http=require("http").createServer(app)

const io=require("socket.io")(http)
let users=[]
io.on("connection",(socket)=>{
    console.log("connected")
    socket.on("message",(msg)=>{
        users.push(msg.user)
        console.log(msg,users)
        socket.broadcast.emit("message",msg)
    })
    io.emit("users", users);
})

let port=process.env.port||7678
app.use(express.json())
app.use(cors())



app.get("/",(req,res)=>{
    res.send("home page")
})

app.use("/user",userroute)





http.listen(port,async()=>{
    try {
        await connect
        console.log("db connected")
    } catch (error) {
        console.log(error)
    }
    console.log("server is running")
})

