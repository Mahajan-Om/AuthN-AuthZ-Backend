const bcrypt = require('bcrypt');  // to convert password string into secure format so it is hard to hacked.

const userdata =  require("../models/userdata");  // momngodb se contact krne ke liye model bhi import kr liya

const jwt = require('jsonwebtoken');  // import jwt to use it

require("dotenv").config();

// sign up route handler
exports.signup = async (req,res)=>{
    try{
        // get data
        const {name,email,password,role} = req.body;

        // check if user already exists
        const existinguser = await userdata.findOne({email});

        if(existinguser){
            return res.status(400).json({
                success : false,
                messege : "User Already exits."
            });
        }


        // to make secure password that is to convert password string to secure password by using bcrypt hash function jisme ek paraneter jo hash krna hai vo hota hai aur ek no. of round hote hai becz hash krne ke liye diff rounds use hote hai har ek round me thodhe thodhe changes hote hai
       
        let hashedpassword;

        try{
            hashedpassword = await bcrypt.hash(password,10);
        }
        catch(err){
            res.status(500).json({
                success : false,
                messege : "Error in hashing the password"
            });
        }

        // create a user entry in db
        const user = await userdata.create({
            name ,email, password:hashedpassword,role
        })

        return res.status(200).json({
            success : true,
            messege : "user Created Successfully"
        })

    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success : false,
            messege : "User cannot be registered , please try again later !!!"
        })
    };
}


// login rouetr controller 

exports.login = async (req,res)=>{

    try{
        // data fetch
        const {email,password} = req.body;

        // validate data
        if(!email || !password){   // agr email ya pswd kuch data present nhi hai.
            res.status(400).json({
                success : false,
                messege : "Please fill the above credential correctly !"
            })
        }

        // check for registered email i.e ye email ki entry hai ya nhi
        
        // if user is not registered i.e enrtry nhi mili
        
        let user = await userdata.findOne({email}); // input email wala entry return karo db ke ander se ab isme email , role , password name sb hi hoha becz db se ek entry hi nikali puri

        if(!user){
            return res.status(401).json({
                success : false,
                messege : "user is not registered !"
            })
        }
        
        // ab user ki entry mil gyi tb login krne ke baad ek token banake client ko dede so further request usi token ke sath ho aur aur baar baar authentication and authorization krne ki zarurat nhi hai
        const payload = {
            email:user.email,
            id:user._id,
            role:user.role,
        }

        // verify password and generate jwt token
        if(await bcrypt.compare(password,user.password)){  // password to jo user ne diya wo aur user.password database ke ander ka pswd jo humen bcrypt se hashed kiya tha signin form ke ander
            // password match // create JWT TOken 
            let token = jwt.sign(payload,
                                    process.env.JWT_SECRET,
                                    {
                                        expiresIn:"2h"
                                    }
            )
            
            // extra iske bina bhi ho sakt hai but api request send krne ke bad token nhi aa rh ath aisliye ye lika 
            user = user.toObject();
            user.token = token;   // user wale obj ke ander token field bana ke usme ye jwt token dal diya but tb badme req ke sath agr token bheja to password bhi chale jayega isliye user.password ko undefined kr denge db ke ander se password nhi hataya db ke ander se ek object nikala that usme password ko undefined kr diya 
            user.password = undefined;

            const options = {
                expires : new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),  // abhi se lekr 3 din tk 
                httpOnly : true // cannot modified at client server
            }

            res.cookie("token",token,options).status(200).json({  // respo se ke ander hi cookie bhej di ab usme 3 parameters hote hai (name,value,,options(kb expires hoga etc)) 
                success:true,
                token,
                user,
                messege : "User is logged in successfully ."
            });

            // res.status(200).json({  // respo se ke ander hi cookie bhej di ab usme 3 parameters hote hai (name,value,,options(kb expires hoga etc)) 
            //     success:true,
            //     token,
            //     user,
            //     messege : "User is logged in successfully ."
            // });
        }
        else{
        // password do not matched
            res.status(402).json({
                success:false,
                messege:"Password Incorrect !"
            })
        }
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            messege : "Login Failure"
        })
    }
}