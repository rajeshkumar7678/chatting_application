const express=require("express")
const redis=require("ioredis")
require("dotenv").config()

const app=express()

const configuration={
    host:process.env.redisurl,
    port:19701,
    username:"default",
    password: process.env.redispassword
}

const client=new redis(configuration)
app.use(express.json())

module.exports={
    client
}