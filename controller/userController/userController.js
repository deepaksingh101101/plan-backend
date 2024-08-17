import userModel from '../../models/userModel.js';
import Jwt from 'jsonwebtoken'

// import {body} from 'express-validator'
import bcrypt from "bcrypt";
import {validationResult} from 'express-validator'
// import { generateOTP } from '../../middleware/generateOtp.js';
// import otpModel from '../../models/otpModel.js';




export const loginController = async (req, res, next) => {
  const errors = validationResult(req);
  const { email, password } = req.body;

  if (errors.isEmpty()) {
      try {
          const isUserExist = await userModel.findOne({ email });

          if (!isUserExist) {
              return res.status(404).json({ status: false, message: "User does not exist with this email" });
          }

          const plainPassword = await bcrypt.compare(password, isUserExist.password);

          if (!plainPassword) {
              return res.status(401).json({ status: false, message: "Invalid email or password" });
          }

          const accessToken = Jwt.sign({ payload: isUserExist?._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '365d' });
          const refreshToken = Jwt.sign({ payload: isUserExist?._id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '365d' });

          // Set the refresh token in Redis or another secure data store
          // Example: await redisClient.set(refreshToken, user._id, 'EX', 7 * 24 * 60 * 60); // Set expiry to 7 days

          // Assigning refresh and access token in http-only cookie 
          res.cookie('refreshToken', refreshToken, { httpOnly: true, sameSite: 'None', secure: process.env.NODE_ENV === 'production' });
          res.cookie('accessToken', accessToken, { httpOnly: true, sameSite: 'None', secure: process.env.NODE_ENV === 'production' });

          // Return user details and tokens
          return res.status(201).json({ status: true, user: { _id: isUserExist._id, email: isUserExist.email, isSuperAdmin:isUserExist?.isSuperAdmin }, accessToken, refreshToken });
      } catch (error) {
          console.error("Login error:", error);
          return res.status(500).json({ status: false, message: "Internal server error" });
      }
  } else {
      return res.status(422).json({ status: false, errors: errors.array() });
  }
};




export const registerController = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const { name,email, password } = req.body;
  

    const isUserExist = await userModel.findOne({ email: email });
    if (isUserExist) {
      return res.status(400).json({
        status: false,
        message: "User with this email already exists"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = new userModel({
      name:name,
      email: email,
      password: hashedPassword,
    });
    await newUser.save();

    return res.status(201).json({
      status: true,
      message: "User Created Successfully"
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: false,
      error,
      message: "Internal Server Error"
    });
  }
}
























export const updateAdminProfile = async (req, res) => {
  const { email, name, isSuperAdmin } = req.body;

  try {
      // Ensure only super admins can update admin profiles
      if (!req.userInfo.isSuperAdmin) {
          return res.status(403).json({ status: false, message: "Forbidden: Only super admins can update admin profiles" });
      }

      const user = await userModel.findOneAndUpdate(
          {email:email},
          { name, isSuperAdmin },
          { new: true }
      );

      if (!user) {
          return res.status(404).json({ status: false, message: "User not found" });
      }

      return res.status(200).json({ status: true, message: "Admin profile updated successfully", user });
  } catch (error) {
      console.error("Error updating admin profile:", error);
      return res.status(500).json({ status: false, message: "Internal Server Error" });
  }
};

export const accessTokenFromRefresh = async (req, res, next) => {
  try {
    const incomingRefreshToken = req.cookies?.refreshToken || req.body?.refreshToken;

    

    if (!incomingRefreshToken) {
      return res.status(401).json({ message: "Unauthorized Refresh Token" });
    }

    const decodedToken = Jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);

    const user = await userModel.findById(decodedToken?.payload);

    
    if (!user || incomingRefreshToken !== user?.refreshToken) {
      return res.status(400).json({ message: "Invalid Refresh Token" });
    }

    const accessToken = Jwt.sign({ payload: user?._id }, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: '2d'
    });

    const refreshToken = Jwt.sign({ payload: user?._id }, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: '7d'
    });

    await userModel.findByIdAndUpdate(user._id, { refreshToken });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      sameSite: 'None',
      secure: true,
     
    }).cookie('accessToken', accessToken, {
      httpOnly: true,
      sameSite: 'None',
      secure: true,
     
    });

    return res.status(201).json({
      status: true,
      accessToken,
      refreshToken
    });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};


export const sendOtp = async (req, res, next) => {
  const errors = validationResult(req);
  const { email } = req.body;

  try {
    if (errors.isEmpty()) {
      const isUserExist = await userModel.findOne({ email });
      if (isUserExist===null) {
        return res.status(400).json({
          status: false,
          message: "User does not exist with this email"
        });
      }

      const otp=generateOTP()

      const isExist = await otpModel.findOne({ email });

      if (isExist) {
      
          // Delete the entry from the OTP model
          await otpModel.findOneAndDelete({ email });
      
      } else {
        console.log("Entry does not exist.");
      }
      



      const newOtp=new otpModel({
        email:email,
        otp:otp,
      })

      await newOtp.save();


      // Create a Nodemailer transporter
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: 'deepaksingh104104@gmail.com', // Enter your Gmail email address
          pass: 'dcxh kzax fotp wbmq' // Enter your Gmail password
        }
      });

      // Define email options
      const mailOptions = {
        from: 'deepaksingh104104@gmail.com', // Sender email address
        to: email, // Recipient email address from the request body
        subject: 'Verify Your HMS OTP', // Email subject
        text: `Hii, ${otp} is your OTP to reset Your MYTR Password ` // Email body
      };

      // Send email
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log("Error:", error);
          return res.status(500).json({status:false, message: "Failed to send email" });
        } else {
          console.log('Email sent: ' + info.response);
          return res.status(200).json({status:true, message: "Email sent successfully" });
        }
      });
    } else {
      return res.status(422).json({ errors: errors.array() });
    }
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};


export const verifyOtp = async (req, res, next) => {
  const errors = validationResult(req);
  const { otp,email } = req.body;

  try {
    if (errors.isEmpty()) {
      const isUserExist = await userModel.findOne({ email });

      if (!isUserExist) {
        return res.status(200).json({
          status: false,
          message: "User does not exist with this email"
        });
      }

      
      const isOtpValid=await otpModel.findOne({email:email,otp:otp})


      if (isOtpValid) {
       await otpModel.findOneAndUpdate({email:email},{isVerified:true})
      return res.status(200).json({status:"true",message:"OTP verified, Now You Can Reset Your Password  "})
      } else {
        return res.status(400).json({status:"false",message:"Incorrect OTP"})
      }
      
    } else {
      return res.status(422).json({ errors: errors.array() });
    }
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const resetPasswordAfterVerification = async (req, res, next) => {
  const errors = validationResult(req);


  const { password,email } = req.body;

  try {
    if (errors.isEmpty()) {
      const isVerified=await otpModel.findOne({email})

      if(isVerified?.isVerified===true){
        const hashedPassword = await bcrypt.hash(password, 12);

        const isUserExist = await userModel.findOneAndUpdate({email},{password:hashedPassword})
        
        if(isUserExist){
          const isExist = await otpModel.findOne({ email });

      if (isExist) {
      
          // Delete the entry from the OTP model
          await otpModel.findOneAndDelete({ email });
      
      } else {
        console.log("Entry does not exist.");
      }
          return res.status(200).json({status:"true",message:"Password Reset SuccessFully"})
        }


        

      }else{
        return res.status(400).json({status:"false",message:"Otp not verified yet"})

      }
      
    } else {
      return res.status(422).json({ errors: errors.array() });
    }
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};




