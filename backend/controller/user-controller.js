import User from "../models/user.js";
import dotenv from "dotenv";

dotenv.config();

export const updateUserInfo=async(req,res)=>{
    try {
        const {username,money,tools,items}=req.body;
        let user=new User({
            username,money,tools,items
        })
        await user.save()

        return res.status(200).send("Info updated")
    } catch (error) {
        console.log(error);
        return res.status(500).json({msg:"error updating info"})
    }
}

export const getUserInfo=async(req,res)=>{
    try {
        const {username}=req.body;
        console.log(req.body)
        const data= await User.findOne({username});
        console.log(data);
        return res.status(200).json(data);
    } catch (error) {
        return res.status(500).json({msg:"error getting info"})
    }
}