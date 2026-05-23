import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import config from "../../config";
import { pool } from "../../db";
import type { ISingupUser } from "./auth.interface";

const createUser = async (payload: ISingupUser) => {
  const { name, email, password, role } = payload;

  const hashedPassword = await bcrypt.hash(password, 13); // Implement password hashing here

  const result = await pool.query(
    `
    INSERT INTO users(name, email, password, role)
    VALUES($1, $2, $3, COALESCE($4, 'user'))
    RETURNING *
    `,
    [name, email, hashedPassword, role],
  );

  delete result.rows[0].password;

  return result;
};

const loginUser = async (payload: { email: string; password: string }) => {
  const { email, password } = payload;

  // 1. check if user exists
  const userData = await pool.query(`SELECT * FROM users WHERE email=$1`, [
    email,
  ]);

  if (userData.rowCount == 0) {
    throw new Error("Invalid credentials");
  }

  const userInfo = userData?.rows[0];

  // 2. compare password with the user password
  const isMatchedPassword = await bcrypt.compare(password, userInfo.password);
  if (!isMatchedPassword) {
    throw new Error("Invalid credentials");
  }

  // 3. generate jwt access token

  const jwtpayload = {
    email: userInfo.email,
    id: userInfo.id,
    is_active: userInfo.is_active,
    name: userInfo.name,
    role: userInfo.role,
  };

  const token = jwt.sign(jwtpayload, config.jwt_secret as string, {
    expiresIn: "1d",
  });

  delete userInfo.password;

  return { token, user: userInfo };
};

export const authService = {
  createUser,
  loginUser,
};
