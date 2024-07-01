// const express= require("express"); // instead of using this we will use import for that we have to change the type to module in package.json
// these are our package inputs
import path from "path";
import express from "express";
import dotenv from "dotenv";
import cors from 'cors';




// these are our file inputs
import authRoutes from "./routes/auth.routes.js"
import messageRoutes from "./routes/message.routes.js";
import userRoutes from "./routes/user.routes.js";
import connectToMongoDB from "./db/connectToMongoDB.js";
import cookieParser from "cookie-parser";
import {app,server} from "./socket/socket.js";
// const dotenv=require("dotenv");

dotenv.config();

const __dirname = path.resolve();

//these are our variables
// const app=express();
// PORT should be assigned after calling dotenv.config() because we need to access the env variables
const PORT=process.env.Port||5000;  // we use from .env file





// thses are our middlewares
app.use(cors());
app.use(express.json());// this will allow us to extract the fields from the req.body from controllers
app.use(cookieParser());
app.use("/api/auth",authRoutes); // when we will visit this route we will call authRoutes
app.use("/api/messages",messageRoutes);
app.use("/api/users",userRoutes);


// app.get("/",(req,res)=>{
//     // root route http://localhost:5000/
//     res.send("Hello World!");
// });

// app.use("/api/auth",authRoutes); // when we will visit this route we will call authRoutes

app.use(express.static(path.join(__dirname,"/frontend/dist")));

app.get("*", (req,res) => {
        res.sendFile(path.join(__dirname,"frontend","dist","index.html"));
});

server.listen(PORT,()=> {
        connectToMongoDB();
        console.log(`Server is running on port ${PORT}`)
});