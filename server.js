
const cookieParser = require("cookie-parser");
const { name } = require("ejs");
const express=require("express");
const app=express();
const http=require("http");
const server=http.createServer(app);
const {Server}=require("socket.io");
const io=new Server(server);
app.use(express.urlencoded({ extended: true }));
app.set("view engine","ejs");

app.use(cookieParser())

app.get("/",(req,res)=>{
    res.render("index")
})
app.post("/login",(req,res)=>{
    const{name}=req.body;
 // res.cookie("name",name);
    res.render("chat",{name});   
})


const users={};

io.on("connection",(Socket)=>{

    console.log("New user has connected",Socket.id);
    Socket.on("chatMessage",(data)=>{
        const {user,text}=data;
        users[Socket.id]=data.name
      //  console.log(users[Socket.id])
        io.emit("broadcastMessage",{text:text,user:user})
    })

    Socket.on("typing",(data)=>{
        const name=data.user;
        users[Socket.id]=name
        // console.log(users[Socket.id])
        Socket.broadcast.emit("isActive",{user:users[Socket.id]})
    })
    
    Socket.on("disconnect",()=>{
        console.log("User disconnected")
    })
})
   

server.listen(8888,(err)=>{
if(err){console.log(err)}
else console.log("server started")
})

