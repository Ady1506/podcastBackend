import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET

export const tokenDuration= 15*24*60*60 // 15 days

export const generateToken=(userId: number,expiresIn: number=tokenDuration): string=>{
    const token= jwt.sign({userId}, JWT_SECRET, {expiresIn});
    return token;
}
export const verifyToken=(token:string): number=>{
    const {userId}= jwt.verify(token, JWT_SECRET) as {userId: number};
    return userId;  
}