import User from '../models/User.js';
import { generateOTP } from '../utils/otpUtils.js';
import jwt from 'jsonwebtoken';

export async function requestOtp(req, res) {
    try {
      const { phone } = req.body;
  
      // Check if the phone number is valid (10 digits)
      if (phone.length !== 10) {
        return res.send.json({ status: 400, body: { error: 'Invalid Phone Number' } });
      }
  
      // Check if the phone number is already registered
      let user = await User.findOne({ phone });
  
      if (!user) {
        const otp = generateOTP();
  
        // Create a new user record
        user = new User({
          phone,
          otp,
          otpExpires: new Date(Date.now() + 600000),
          otpCount: 1
        });
        await user.save();
        console.log('New user created',otp);
        // Send OTP to user phone number
        return res.send.json({ message: 'OTP sent successfully', success: true });
      } else {
        // User already exists
  
        // If otp count is 3, block the user for 24 hours
        if (user.otpCount === 3) {
          const otpTriesExpires = new Date();
          otpTriesExpires.setHours(otpTriesExpires.getHours() + 24);
  
          user.otpTriesExpires = otpTriesExpires;
          await user.save();
  
          return res.send.json({ status: 400, body: { error: 'You have exceeded the maximum number of attempts. Please try again after 24 hours' } });
        } else if (user.otpTriesExpires) {
          const currentTime = new Date();
  
          if (currentTime < user.otpTriesExpires) {
            // User is trying before the expiration time, show an error message
            return res.send.json({ status: 400, body: { error: 'Please try again after 24 hours' } });
          } else {
            // User is trying after the expiration time, reset OTP count and update the user
            user.otpCount = 1;
            user.otpTriesExpires = undefined;
            await user.save();
          }
        }
  
        const otp = generateOTP();
        console.log('Otp',otp);
  
        // Update the user with the new OTP, OTP expiry, and increment the OTP count
        user.otp = otp;
        user.otpExpires = new Date(Date.now() + 600000);
        user.otpCount++;
        await user.save();
  
        // Send OTP to user phone number
        return res.json({ message: 'OTP sent successfully', success: true });
      }
    } catch (error) {
      return res.json({ status: 500, body: { error: error.message } });
    }
  }

  export async function login_post(req, res) {
    try {
      const { phone, otp } = req.body;
  
      // Check if the phone number is valid (10 digits) and if the OTP is of 4 digits
      if (phone.length !== 10 || otp.length !== 4) {
        return res.json({ status: 400, body: { error: 'Invalid Phone Number or OTP' } });
      }
  
      // Check if the phone number is registered
      const user = await User.findOne({ phone });
      if (!user) {
        return res.json({ status: 400, body: { error: 'Phone number does not exist' } });
      }
  
      // Check if the OTP is valid
      if (user.otp !== otp) {
        return res.json({ status: 400, body: { error: 'Invalid OTP' } });
      }
  
      // Check if the OTP is expired
      if (user.otpExpires < Date.now()) {
        return res.json({ status: 400, body: { error: 'OTP expired' } });
      }
  
      // Create token data
      const tokenData = {
        id: user._id,
        phone: user.phone,
        name: user.name,
        email: user.email,
        role: user.role,
      };
  
      // Generate the token
      const token = jwt.sign(tokenData, process.env.TOKEN_SECRET, { expiresIn: '1d' });
  
      // Update user.otpCount to 0 and otpTriesExpires to undefined
      user.otpCount = 0;
      user.otpTriesExpires = undefined;
      user.otp = undefined;
      await user.save();
  
      res.json({ message: 'Login Successful', success: true, data: { ...tokenData, token } });
  
    } catch (error) {
      console.log(error);
      return res.json({ status: 500, body: { error: error.message } });
    }
  }
  
