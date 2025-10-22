// lib/auth.js
import { compare, hash } from 'bcryptjs';

export async function hashPassword(password) {
  const hashedPassword = await hash(password, 8); // 12 is the salt rounds
  return hashedPassword;
}

export async function verifyPassword(password, hashedPassword) {
  const isValid = await compare(password, hashedPassword);
  return isValid;
}