// auth isstudent isadmin

const jwt = require('jsonwebtoken');

require("dotenv").config();

exports.auth = (req,res,next) =>{
    // we are doing authentication
   
    try{

         // extract jwt token
         // there are different ways to access token from header and cokkies also

         console.log("cookie" , req.cookies?.token);
         console.log("body" , req.body?.token);
        // console.log("header" , req.header("Authorization"));
         
         const token =  req.cookies.token || req.body.token || req.header("Authorization") .replace("Bearer ","");  // cookkies me se token nikal tha isliye cookie-parser hse kiya // body me se token nikalna tha isliye body-parser use kiya ab jwt token me Authorization : Bearer <token>  aisa rehta hai ab header me authorization me jake berear ko empty string ko replace kr diya to bs token hi bach a aur fetch kr liya 

         if(!token){
            return res.status(401).json({
                success : false,
                messege : "Token Missing "
            })
         }

         // verify the token
         try{
            const decode = jwt.verify(token,process.env.JWT_SECRET);  // matched token ka payload save kr liya decode ke ander
            console.log(decode);
            // why this ?
            req.user = decode; // humne request ke ander matched token ka payload save kr loya taki aage wale middlewares me se role ko use kr sake authentication ke loye
         } catch(error){
             return res.status(401).json({
                success : false,
                messege : "Invalid Token !"
            })
         }

         next(); // next middleware me jane ke liye
        
    }
    catch(error){
        return res.status(401).json({
            success:false,
            messege:"Something went wrong while verifying the token",            
        });
    }
}

exports.isStudent = (req,res,next)=>{
    try{
        if(req.user.role !== 'Student'){  // humne decode ke ander payload ko sav ekr liya tha aur usko req k=me bhej diya tha usi req me se decode me se role nikal liya
            return res.status(401).json({
                success:false,
                messege: 'This is the protected route for the students'
            })
        }
        next();
    }
    catch(error){
        return res.status(500).json({
            success:false,
            messege : "User Role is not matching"
        })
    }
}

exports.isAdmin = (req,res,next)=>{
    try{
        if(req.user.role !== 'Admin'){  // humne decode ke ander payload ko sav ekr liya tha aur usko req k=me bhej diya tha usi req me se decode me se role nikal liya
            return res.status(401).json({
                success:false,
                messege: 'This is the protected route for the Admin'
            })
        }
        next();
    }
    catch(error){
        return res.status(500).json({
            success:false,
            messege : "User Role is not matching"
        })
    }
}