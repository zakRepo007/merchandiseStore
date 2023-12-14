import { Request, Response } from 'express';
import { User } from '../types/types';
import * as fs from 'fs';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

const usersPath = 'data/users.json';

// Helper function to read users data
const readUsers = (): User[] => {
    return JSON.parse(fs.readFileSync(usersPath, 'utf-8'));
};

// User registration
export const registerUser = async (req: Request, res: Response) => {
    try {
        const { username, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        

        res.status(201).send('User registered successfully');
    } catch (error) {
        res.status(500).send('Error registering user');
    }
};

// User login
export const loginUser = async (req: Request, res: Response) => {
    try {
        const { username, password } = req.body;
        const users = readUsers();
        const user = users.find(u => u.username === username);

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).send('Authentication failed');
        }

        const token = jwt.sign({ userId: user.id }, 'your_jwt_secret', { expiresIn: '1h' });
        res.status(200).json({ token });
    } catch (error) {
        res.status(500).send('Error logging in');
    }
};
