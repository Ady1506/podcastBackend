import { Request, Response } from "express";
import {createUser, findUserByEmail, findUserById, updateUserPassword } from "../models/user_model.ts";
import { hashPassword, comparePassword } from "../utils/passwordUtils.ts";
import { generateToken, tokenDuration, verifyToken } from "../utils/jwtUtils.ts";
import { User } from "../models/user_model.ts";
import { validateEmail, validatePassword, validatePhone, validateUsername } from "utils/validators.ts";

export const registerUser= async(req: Request, res: Response): Promise<void>=>{
    try{
        console.log(req.body);
        const {username, first_name, last_name, password, email, phone, account_type,created_at}=req.body;
        if(!username || !first_name || !last_name || !password || !email || !phone || !account_type || !created_at){
            res.status(400).json({message: 'All fields are required'});
            return;
        }
        if(!validateUsername(username)){
            res.status(400).json({message: 'Invalid username'});
            return;
        }
        if(!validateEmail(email)){
            res.status(400).json({message: 'Invalid email'});
            return;
        }
        if(!validatePassword(password)){
            res.status(400).json({message: 'Invalid password'});
            return;
        }
        if(!validatePhone(phone)){
            res.status(400).json({message: 'Invalid phone number'});
            return;
        }
        const existingUser= await findUserByEmail(email);
        if(existingUser){
            res.status(400).json({message: 'User already exists'});
            return;
        }
        const hashedPassword= await hashPassword(password);
        const newUser: User= await createUser({
            username,
            first_name,
            last_name,
            password_hash: hashedPassword,
            email,
            phone,
            account_type,
            created_at
        });
        const token= generateToken(newUser.user_id);

        res.cookie('jwt',token,{httpOnly:true, maxAge: tokenDuration*1000});
        res.status(201).json({
            message: 'User created successfully', 
            status: "success",
            user:newUser,
            token: token
        });
    }
    catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({status:"failed",message: 'Internal server error'});
    }
}

export const loginUser= async(req: Request, res: Response): Promise<void>=>{
    try{
        const {email,password}=req.body;
        if(!email || !password){
            res.status(400).json({message: 'Email and password are required'});
            return;
        }
        if(!validateEmail(email)){
            res.status(400).json({message: 'Invalid email'});
            return;
        }
        if(!validatePassword(password)){
            res.status(400).json({message: 'Invalid password'});
            return;
        }
        const user= await findUserByEmail(email);
        if(!user){
            res.status(400).json({message: 'User not found'});
            return;
        }
        const isPasswordValid= await comparePassword(password, user.password_hash);
        if(!isPasswordValid){
            res.status(400).json({message: 'Invalid password'});
            return;
        }
        const token= generateToken(user.user_id);
        res.cookie('jwt',token,{httpOnly:true, maxAge: tokenDuration*1000});
        res.status(200).json({
            message: 'User logged in successfully', 
            status: "success",
            user: user,
            token: token
        });
    }
    catch (error) {
        console.error('Error logging in user:', error);
        res.status(500).json({status:"failed",message: 'Internal server error'});
    }
}

export const logoutUser= async(req:Request, res:Response): Promise<void>=>{
    res.cookie('jwt','',{maxAge:1});
    res.status(200).json({message: 'User logged out successfully', status: "success"});
}

export const resetPassword= async(req:Request, res:Response): Promise<void>=>{
    try{
        const {password, new_password}=req.body;
        if(!password || !new_password){
            res.status(400).json({message: 'Password and new password are required'});
            return;
        }
        if(!validatePassword(password)){
            res.status(400).json({message: 'Invalid password'});
            return;
        }
        if(!validatePassword(new_password)){
            res.status(400).json({message: 'Invalid new password'});
            return;
        }
        const token= req.cookies.jwt;
        if(!token){
            res.status(401).json({message: 'Unauthorized'});
            return;
        }
        const userId= verifyToken(token);
        if(!userId){
            res.status(401).json({message: 'Unauthorized'});
            return;
        }
        const user= await findUserById(userId);
        if(!user){
            res.status(400).json({message: 'User not found'});
            return;
        }
        const isPasswordValid= await comparePassword(password, user.password_hash);
        if(!isPasswordValid){
            res.status(400).json({message: 'Invalid password'});
            return;
        }
        const hashedPassword= await hashPassword(new_password);
        const updatedUser= await updateUserPassword(userId, hashedPassword);
        if(!updatedUser){
            res.status(400).json({message: 'Error updating password'});
            return;
        }
        res.status(200).json({
            message: 'Password updated successfully', 
            status: "success",
            user: updatedUser
        });

    }
    catch (error) {
        console.error('Error resetting password:', error);
        res.status(500).json({status:"failed",message: 'Internal server error'});
    }
}