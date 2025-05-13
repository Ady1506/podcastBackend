import bcrypt from 'bcrypt';

export const hashPassword = async (password: string): Promise<string>=>{
    try{
        const salt=10;
        const hashedPassword= await bcrypt.hash(password,salt);
        return hashedPassword;
    }
    catch (error) {
        console.error('Error hashing password:', error);
        throw new Error('Error hashing password');
    }
}

export const comparePassword=async(password:string, hashesPassword:string): Promise<boolean>=>{
    try{
        return await bcrypt.compare(password, hashesPassword);
    }
    catch (error) {
        console.error('Error comparing password:', error);
        throw new Error('Error comparing password');
    }
}