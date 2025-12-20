import express from 'express';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';
import { getUserByEmail, getUserByPhone } from '../services/userService';

const router = express.Router();

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await getUserByEmail(email);
    if (!user) {
        return res.status(400).json({ message: 'Invalid email or password' });
    }
    if (user.passwordHash !== password) {
        return res.status(400).json({ message: 'Invalid email or password' });
    }
    const token = await generateToken(user);
    res.status(200).json({ token });
});