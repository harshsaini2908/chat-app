import bcrypt from "bcryptjs";
import User from '../models/user.model.js';
import generateTokenAndSetCookie from "../utils/generateToken.js";

export const signup = async (req,res) => {
    try{
            const {fullName, username, password, confirmPassword,gender}=req.body;

            if(password!==confirmPassword){
                return res.status(400).json({error:"Passwords dont match"})
            }

            const user= await User.findOne({username});

            if(user)
            {
                    res.status(400).json({error:"Username already exists"});
            }

            // HASH Password HERE

            const salt = await bcrypt.genSalt(10); // valuse inside bracket is high more secure but slower
            const hashedPassword= await bcrypt.hash(password,salt);
            // https://avatar-placeholder.iran.liara.run/   
            // api for random profile pic
             
            const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`
            const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`

            const newUser= new User({
                fullName,
                username,
                password:hashedPassword,
                gender,
                profilePic: gender === "male" ? boyProfilePic : girlProfilePic,
            });
            
            if(newUser){
                // Generate JWT token here
                generateTokenAndSetCookie(newUser._id,res);
            await newUser.save(); // to save in the database

            res.status(201).json({
                _id:newUser._id,
                fullName:newUser.fullName,
                username:newUser.username,
                profilePic:newUser.profilePic
            });
        }else{
            res.status(400).json({error:"Invaid user data"});
        }


    }catch(error){
            console.log("Error in signup controller",error.message);
            res.status(500).json({error:"Internal Server Error"});
    }
};

export const login = async (req,res) => {
    try{
            const {username,password}=req.body;
            const user = await User.findOne({username});
            const isPasswordCorrect= await bcrypt.compare(password,user?.password || "");

            if(!user || !isPasswordCorrect){
                return res.status(400).json({error:"Invalid username or password"});
            }

            generateTokenAndSetCookie(user._id,res);

            res.status(200).json({
                _id: user._id,
                fullName: user.fullName,
                username: user.username,
                profilePic:user.profilePic,
            });
    }catch(error){
        console.log("Error in login Controller",error.message);
        res.status(500).json({error: "Internal Server Error"});
    }
};

export const logout = async(req,res) => {
    try{
        res.cookie("jwt","",{maxAge:0});
        res.status(200).json({message:"Logged out successfully"});
    }catch(error){
        console.log("Error in logout controller",error.message);
        res.status(500).json({error:"Internal Server Error"});
    }
}