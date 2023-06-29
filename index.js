const express=require("express")
const { connect } = require("./db")
const { userroute } = require("./routes/userroute")
const {socket}=require("socket.io")
const cors=require("cors")
require("dotenv").config()
const app=express()
const http=require("http").createServer(app)

const io=require("socket.io")(http)

io.on("connection",(socket)=>{
    console.log("connected")
    socket.on("massage",(msg)=>{
        console.log(msg)
        socket.broadcast.emit("massage",msg)
    })
})

let port=process.env.port||7678
app.use(express.json())
app.use(cors())



app.get("/",(req,res)=>{
    res.send("homr page")
})

app.use("/user",userroute)





http.listen(port,async()=>{
    try {
        await connect
        console.log("db connected")
    } catch (error) {
        console.Log(error)
    }
    console.log("server is running")
})

