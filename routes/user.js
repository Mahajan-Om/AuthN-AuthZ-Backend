const express = require('express');
const router = express.Router();

const {login,signup} = require("../Controllers/Auth");
const {auth,isStudent,isAdmin} = require("../middlewares/auth")

router.post("/login", login);
router.post("/signup", signup);

// protected Route mtlb bs ek perticular role wale ko hi route ka access do hence authorization

// testing of protected route with single middleware

router.get("/test", auth ,(req,res)=>{  // param me (path , sare middleware auth me authenticvation hoga aur isStudent me authorization , last me handler function )
    res.json({
        success : true,
        messege : 'Welcome to the protected Route of Tests'
    })
})
router.get("/student", auth , isStudent , (req,res)=>{  // param me (path , sare middleware auth me authenticvation hoga aur isStudent me authorization , last me handler function )
    res.json({
        success : true,
        messege : 'Welcome to the protected Route of students'
    })
})

router.get("/admin", auth , isAdmin , (req,res)=>{  // param me (path , sare middleware auth me authenticvation hoga aur isStudent me authorization , last me handler function )
    res.json({
        success : true,
        messege : 'Welcome to the protected Route of admin'
    })
})

module.exports = router;
