import { handleError } from '../Helper/handleError.js';
import { getFirebaseAuth } from '../Config/firebaseAdmin.js';
import User from '../models/usermodel.js';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';

const registerSchema = z.object({
  name: z.string().trim().min(3).max(80),
  email: z.string().trim().email().max(254),
  password: z.string().min(8).max(128),
});

const loginSchema = z.object({
  email: z.string().trim().email().max(254),
  password: z.string().min(1).max(128),
});

const googleSchema = z.object({ idToken: z.string().min(20).max(20_000) });

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
  path: '/',
  maxAge: 24 * 60 * 60 * 1000,
};

const publicUser = (user) => {
  const data = user.toObject ? user.toObject() : user;
  const { password, ...safeUser } = data;
  return safeUser;
};

const validationError = (result, next) => next(handleError(400, result.error.issues[0].message));

const createSession = (res, user) => {
  const token = jwt.sign({ sub: String(user._id) }, process.env.JWT_SECRET, {
    expiresIn: '1d',
    issuer: process.env.JWT_ISSUER || 'blog-api',
    audience: process.env.JWT_AUDIENCE || 'blog-web',
  });
  res.cookie('access_token', token, cookieOptions);
};

export const Register = async (req, res, next) => {
  try {
    const result = registerSchema.safeParse(req.body);
    if (!result.success) return validationError(result, next);
    const { name, password } = result.data;
    const email = result.data.email.toLowerCase();
    const existingUser = await User.findOne({ email }).select('_id');
    if (existingUser) return next(handleError(409, 'An account already exists for this email.'));

    const hashedPassword = await bcryptjs.hash(password, 12);
    await User.create({ name, email, password: hashedPassword });
    res.status(201).json({ success: true, message: 'Registration successful. Please sign in.' });
  } catch (error) {
    next(handleError(500, error.message));
  }
};

export const Login = async (req, res, next) => {
  try {
    const result = loginSchema.safeParse(req.body);
    if (!result.success) return validationError(result, next);
    const email = result.data.email.toLowerCase();
    const user = await User.findOne({ email }).select('+password');
    if (!user || user.status !== 'active') return next(handleError(401, 'Invalid email or password.'));

    const passwordMatches = await bcryptjs.compare(result.data.password, user.password);
    if (!passwordMatches) return next(handleError(401, 'Invalid email or password.'));

    user.lastLoginAt = new Date();
    await user.save();
    createSession(res, user);
    res.status(200).json({ success: true, user: publicUser(user), message: 'Signed in successfully.' });
  } catch (error) {
    next(handleError(500, error.message));
  }
};

export const GoogleLogin = async (req, res, next) => {
  try {
    const result = googleSchema.safeParse(req.body);
    if (!result.success) return validationError(result, next);

    const decodedToken = await getFirebaseAuth().verifyIdToken(result.data.idToken, true);
    if (!decodedToken.email || !decodedToken.email_verified) {
      return next(handleError(401, 'Your Google account must have a verified email address.'));
    }

    const email = decodedToken.email.toLowerCase();
    let user = await User.findOne({ email }).select('+password');
    if (!user) {
      user = await User.create({
        name: decodedToken.name || email.split('@')[0],
        email,
        avatar: decodedToken.picture,
        password: await bcryptjs.hash(crypto.randomUUID(), 12),
      });
    }
    if (user.status !== 'active') return next(handleError(403, 'This account has been suspended.'));

    user.lastLoginAt = new Date();
    await user.save();
    createSession(res, user);
    res.status(200).json({ success: true, user: publicUser(user), message: 'Signed in successfully.' });
  } catch (error) {
    if (error.code?.startsWith('auth/')) return next(handleError(401, 'Google sign-in could not be verified.'));
    next(handleError(500, error.message));
  }
};

export const Logout = async (req, res, next) => {
  try {
    res.clearCookie('access_token', cookieOptions);
    res.status(200).json({ success: true, message: 'Signed out successfully.' });
  } catch (error) {
    next(handleError(500, error.message));
  }
};
