import cloudinary from '../Config/cloudinary.js';
import { handleError } from '../Helper/handleError.js';
import User from '../models/usermodel.js';
import bcryptjs from 'bcryptjs';
import { z } from 'zod';

const userUpdateSchema = z.object({
  name: z.string().trim().min(3).max(80),
  email: z.string().trim().email().max(254),
  bio: z.string().trim().max(500).optional().or(z.literal('')),
  password: z.string().min(8).max(128).optional().or(z.literal('')),
});
const statusSchema = z.object({ status: z.enum(['active', 'suspended']) });

const safeUser = (user) => {
  const data = user.toObject ? user.toObject() : user;
  const { password, ...safe } = data;
  return safe;
};

const isAdmin = (user) => user.role === 'admin';
const canAccessUser = (requestUser, userId) => isAdmin(requestUser) || String(requestUser._id) === String(userId);

const parseCursor = (cursor) => {
  if (!cursor) return null;
  try { return JSON.parse(Buffer.from(cursor, 'base64url').toString('utf8')); } catch { return null; }
};

export const getUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    if (!canAccessUser(req.user, userId)) return next(handleError(403, 'You cannot access this profile.'));
    const user = await User.findById(userId).select('_id name email bio avatar role status createdAt updatedAt lastLoginAt').lean();
    if (!user) return next(handleError(404, 'User not found.'));
    res.status(200).json({ success: true, user });
  } catch (error) {
    next(handleError(400, 'Invalid user identifier.'));
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    if (!canAccessUser(req.user, userId)) return next(handleError(403, 'You cannot update this profile.'));
    const data = JSON.parse(req.body.data || '{}');
    const result = userUpdateSchema.safeParse(data);
    if (!result.success) return next(handleError(400, result.error.issues[0].message));

    const user = await User.findById(userId).select('+password');
    if (!user) return next(handleError(404, 'User not found.'));
    const email = result.data.email.toLowerCase();
    const emailOwner = await User.findOne({ email, _id: { $ne: user._id } }).select('_id');
    if (emailOwner) return next(handleError(409, 'Another account already uses this email.'));

    user.name = result.data.name;
    user.email = email;
    user.bio = result.data.bio;
    if (result.data.password) user.password = await bcryptjs.hash(result.data.password, 12);
    if (req.file) {
      const uploadResult = await cloudinary.uploader.upload(req.file.path, { folder: 'profile-images', resource_type: 'image' });
      user.avatar = uploadResult.secure_url;
    }
    await user.save();
    res.status(200).json({ success: true, user: safeUser(user), message: 'Profile updated successfully.' });
  } catch (error) {
    if (error instanceof SyntaxError) return next(handleError(400, 'Invalid profile data.'));
    next(handleError(500, error.message));
  }
};

export const getAllUsers = async (req, res, next) => {
  try {
    if (!isAdmin(req.user)) return next(handleError(403, 'Administrator access is required.'));
    const limit = Math.min(Math.max(Number.parseInt(req.query.limit, 10) || 20, 1), 100);
    const query = String(req.query.q || '').trim().slice(0, 80);
    const role = req.query.role;
    const status = req.query.status;
    const filter = {};
    if (['user', 'author', 'editor', 'admin'].includes(role)) filter.role = role;
    if (['active', 'suspended'].includes(status)) filter.status = status;
    if (query) {
      const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      filter.$or = [{ name: { $regex: escaped, $options: 'i' } }, { email: { $regex: escaped, $options: 'i' } }];
    }
    const cursor = parseCursor(req.query.cursor);
    if (cursor?.createdAt && cursor?.id) {
      filter.$and = [{
        $or: [
          { createdAt: { $lt: new Date(cursor.createdAt) } },
          { createdAt: new Date(cursor.createdAt), _id: { $lt: cursor.id } },
        ],
      }];
    }
    const users = await User.find(filter)
      .select('_id name email bio avatar role status createdAt lastLoginAt')
      .sort({ createdAt: -1, _id: -1 })
      .limit(limit + 1)
      .lean();
    const hasNextPage = users.length > limit;
    const page = hasNextPage ? users.slice(0, limit) : users;
    const lastUser = page.at(-1);
    const nextCursor = hasNextPage && lastUser
      ? Buffer.from(JSON.stringify({ createdAt: lastUser.createdAt, id: lastUser._id })).toString('base64url')
      : null;
    res.status(200).json({ users: page, nextCursor, hasNextPage });
  } catch (error) {
    next(handleError(500, error.message));
  }
};

export const updateUserStatus = async (req, res, next) => {
  try {
    if (!isAdmin(req.user)) return next(handleError(403, 'Administrator access is required.'));
    if (String(req.user._id) === req.params.userId) return next(handleError(400, 'You cannot change your own account status.'));
    const result = statusSchema.safeParse(req.body);
    if (!result.success) return next(handleError(400, result.error.issues[0].message));
    const user = await User.findByIdAndUpdate(req.params.userId, { status: result.data.status }, { new: true })
      .select('_id name email role status');
    if (!user) return next(handleError(404, 'User not found.'));
    res.status(200).json({ success: true, user, message: `User ${result.data.status}.` });
  } catch (error) {
    next(handleError(400, 'Invalid user identifier.'));
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    if (!isAdmin(req.user)) return next(handleError(403, 'Administrator access is required.'));
    if (String(req.user._id) === req.params.userid) return next(handleError(400, 'You cannot delete your own account.'));
    const user = await User.findByIdAndDelete(req.params.userid);
    if (!user) return next(handleError(404, 'User not found.'));
    res.status(200).json({ success: true, message: 'User permanently deleted.' });
  } catch (error) {
    next(handleError(400, 'Invalid user identifier.'));
  }
};
