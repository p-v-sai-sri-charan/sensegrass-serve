import User from "../models/User.js";

//from token
export async function getUser(req,res){
    try {
        const userData = req.user;
        const user = await User.findById(userData.id).select('-password');
        res.json({success: true, data: user});
    } catch (error) {
        console.log(error);
        return res.json({ status: 500, body: { error: error.message } });
    }
}

export async function updateUser(req,res){
    try{
        const userData = req.user;
        const user = await User.findById(userData.id);
        if(!user){
            return res.json({ status: 400, body: { error: 'User not found' } });
        }
        const {name,email,phone} = req.body;
        if(name){
            user.name = name;
        }
        if(email){
            user.email = email;
        }
        if(phone){
            user.phone = phone;
        }
        await user.save();
        res.json({success: true, data: user});
    }catch(error){
        console.log(error);
        return res.json({ status: 500, body: { error: error.message } });
    }
}