import client from '../db.ts';

export interface User {
    user_id?: number;
    username?: string;
    first_name?: string;
    last_name?: string;
    password_hash?: string;
    email?: string;
    phone?: string;
    account_type?: 'free' | 'premium';
    created_at?: Date;
    verification_code?: string;
    is_verified?: boolean;
}

export const createUser= async (user:User): Promise<User>=>{
    try{
        const{username, first_name, last_name, password_hash, email, phone, account_type,created_at,verification_code}=user;
        const query=`
            INSERT INTO users (username, first_name, last_name, password_hash, email, phone, account_type,created_at,verification_code)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            RETURNING *;
        `;
        const values=[username, first_name, last_name, password_hash, email, phone, account_type, created_at, verification_code];
        const result= await client.query(query, values);
        return result.rows[0];
    }
    catch (error) {
        console.error('Error creating user:', error);
        throw new Error('Error creating user');
    }
}

export const findUserByEmail= async(email: string): Promise<User | null>=>{
    try{
        const query=`
            SELECT * FROM users WHERE email = $1;
        `;
        const result= await client.query(query,[email]);
        return result.rows.length>0 ? result.rows[0] : null;
    }
    catch (error) {
        console.error('Error finding user by email:', error);
        throw new Error('Error finding user by email');
    }
}
export const findUserById= async(userId: number): Promise<User | null>=>{
    try{
        const query=`
            SELECT * FROM users WHERE user_id = $1;
        `;
        const result= await client.query(query,[userId]);
        return result.rows.length>0 ? result.rows[0] : null;
    }
    catch (error) {
        console.error('Error finding user by ID:', error);
        throw new Error('Error finding user by ID');
    }
}

export const findUserByUsername= async(username: string): Promise<User | null>=>{
    try{
        const query=`
            SELECT * FROM users WHERE username = $1;
        `;
        const result= await client.query(query,[username]);
        return result.rows.length>0 ? result.rows[0] : null;
    }
    catch (error) {
        console.error('Error finding user by username:', error);
        throw new Error('Error finding user by username');
    }
}

export const updateUserPassword= async(userId: number, newPassword: string): Promise<User | null>=>{
    try{
        const query=`
            UPDATE users SET password_hash = $1 WHERE user_id = $2 RETURNING *;
        `;
        const result= await client.query(query,[newPassword, userId]);
        return result.rows.length>0 ? result.rows[0] : null;
    }
    catch (error) {
        console.error('Error updating user password:', error);
        throw new Error('Error updating user password');
    }
}

export const updateUserVerificationCode= async(userId: number, verification_code: string): Promise<User | null>=>{
    try{
        const query=`
            UPDATE users SET verification_code = $1 WHERE user_id = $2 RETURNING *;
        `;
        const result= await client.query(query,[verification_code, userId]);
        return result.rows.length>0 ? result.rows[0] : null;
    }
    catch (error) {
        console.error('Error updating user verification code:', error);
        throw new Error('Error updating user verification code');
    }
}