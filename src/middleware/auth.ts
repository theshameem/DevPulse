import type { NextFunction, Request, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import config from "../config";
import { pool } from "../db";
import type { ROLES } from "../types";
import sendResponse from "../utility/sendResponse";

const auth = (...roles: ROLES[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization;

      if (!token) {
        sendResponse(res, {
          success: false,
          message: "Unauthorized access!!",
          statusCode: 401,
        });
      }

      const decoded = jwt.verify(
        token as string,
        config.jwt_secret as string,
      ) as JwtPayload;

      const userData = await pool.query(`SELECT * FROM users WHERE email=$1`, [
        decoded.email,
      ]);

      if (userData.rowCount == 0) {
        sendResponse(res, {
          success: false,
          message: "User not found!!",
          statusCode: 404,
        });
      }

      const user = userData.rows[0];

      if (roles.length && !roles.includes(user.role)) {
        return sendResponse(res, {
          success: false,
          message: "Forbidden!! User do not have access of the resource",
          statusCode: 403,
        });
      }

      req.user = decoded;

      next();
    } catch (error) {
      next(error);
    }
  };
};

export default auth;
