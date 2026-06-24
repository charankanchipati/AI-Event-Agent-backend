        const express = require("express");
        const router = express.Router();
        const User = require("../models/User");


        // REGISTER

        router.post("/register", async(req,res)=>{


        try{


        const user = new User(req.body);


        await user.save();


        res.json({

        message:"Register successful"

        });


        }
        catch(error){

        res.status(500).json({

        message:error.message

        });

        }


        });


console.log(req.body);


        // LOGIN

        router.post("/login", async(req,res)=>{


        try{


        const {

        username,

        password

        }=req.body;



        const user = await User.findOne({

        username:username

        });



        if(!user){

        return res.json({

        message:"User not found"

        });

        }



        if(user.password !== password){


        return res.json({

        message:"Wrong password"

        });

        }



        res.json({

        message:"Login successful",

        user:{


        id:user._id,

        username:user.username


        }


        });



        }

        catch(error){


        console.log(error);


        res.status(500).json({

        message:error.message

        });


        }


        });




        module.exports = router;