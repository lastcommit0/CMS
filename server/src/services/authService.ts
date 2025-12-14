import jwt from 'jsonwebtoken';
import argon from 'argon2';
import prisma from '../db';
import { loginSchema } from '../validators/authSchema';
import { ar } from 'zod/v4/locales';
import { sign } from 'node:crypto';



const signAccessToken = (payload: any) => {
    jwt.sign(payload, process.env.Secret!, {expiresIn: "15m"});
}

const signRefreshToken = (payload: any) => {
    jwt.sign(payload, process.env.Secret!, {expiresIn: "7d"});
}

export async function login(email: string, password: string){
    const {success, error} = loginSchema.safeParse({email, password});
    if(!success){
        throw new Error('Invalid input');
    }
    const user = await prisma.user.findUnique({
        where: {email}
    });

    const valid = await argon.verify(user?.passwordHash!, password);
    if(!valid){
        throw new Error('Invalid credentials');
    }

    const accessToken = signAccessToken({userId: user?.id, role: user?.role});
    const refreshToken = signRefreshToken({userId: user?.id});
    if(!accessToken || !refreshToken){
        throw new Error('Failed to generate tokens');
    }
    await prisma.session.create({
        data: {
            userId: user?.id,
            refreshTokenHash: refreshToken,
            expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
        },
    });
    return {accessToken, refreshToken};
}

export async function refreshToken(refreshToken: string){
    const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    return res.status(401).json({ error: "No refresh token provided" });
  }
  try {
    const decoded = jwt.verify(refreshToken, JWT_SECRET) as { user: string };

    const newAccessToken = jwt.sign({ user: decoded.user }, JWT_SECRET, { expiresIn: '1h' });
    res.header('Authorization', newAccessToken).json({ user: decoded.user });
  } catch (err) {
    return res.status(403).json({ error: "Invalid refresh token" });
  }
}