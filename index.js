const express = require("express");
const { connect } = require("./db");
const { userroute } = require("./routes/userroute");
const cors = require("cors");
require("dotenv").config();
const app = express();
const http = require("http").createServer(app);

const io = require("socket.io")(http);
let connectedUsers = [];

io.on("connection", (socket) => {
  console.log("connected");

  socket.on("message", (msg) => {
    socket.broadcast.emit("message", msg);
  });

  // Listen for user join
  socket.on("user_join", (username) => {
    connectedUsers.push(username);
    console.log("User joined:", username);
    io.emit("users", connectedUsers);
  });

  // Listen for user disconnect
  socket.on("disconnect", () => {
    console.log("user disconnected");
    const disconnectedUserIndex = connectedUsers.indexOf(socket.id);
    if (disconnectedUserIndex !== -1) {
      connectedUsers.splice(disconnectedUserIndex, 1);
      console.log("User removed:", socket.id);
      io.emit("users", connectedUsers);
    }
  });

  io.emit("users", connectedUsers);
});

let port = process.env.PORT || 7678;
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("home page");
});

app.use("/user", userroute);

http.listen(port, async () => {
  try {
    await connect();
    console.log("db connected");
  } catch (error) {
    console.log(error);
  }
  console.log("server is running");
});
