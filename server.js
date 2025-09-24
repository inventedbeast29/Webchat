
const cookieParser = require("cookie-parser");
const express=require("express");
const app=express();
const http=require("http");
const server=http.createServer(app);
const {Server}=require("socket.io");
const io=new Server(server);
app.use(express.urlencoded({ extended: true }));
app.set("view engine","ejs");

app.use(cookieParser())

io.on("connection",(Socket)=>{
    console.log("New user has connected",Socket.id);

    Socket.on("chatMessage",(data)=>{
        const {user,text}=data;
        io.emit("broadcastMessage",{user:user,text:text})
    })

    Socket.on("typing",(data)=>{
        const name=data.name;
        Socket.broadcast.emit("isActive",{name})
    })
    
    Socket.on("disconnect",()=>{
        console.log("User disconnected")
    })
})
app.get("/",(req,res)=>{
    res.render("index")
})
app.post("/login",(req,res)=>{
    const{name}=req.body;
   // console.log(name)
    res.render("chat",{name});   
})

server.listen(8888,(err)=>{
if(err){console.log(err)}
else console.log("server started")
})

