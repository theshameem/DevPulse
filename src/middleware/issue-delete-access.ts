import type { NextFunction, Request, Response } from "express";
import { pool } from "../db";
import { USER_ROLES } from "../types";
import sendResponse from "../utility/sendResponse";

const issueDeleteAccess = () => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const user = req.user;

    const issue = await pool.query("SELECT * FROM issues WHERE id = $1", [id]);

    if (issue.rowCount === 0) {
      return sendResponse(res, {
        success: false,
        message: "Issue not found",
        statusCode: 404,
      });
    }

    if (user?.role !== USER_ROLES.MAINTAINER) {
      return sendResponse(res, {
        success: false,
        message: "Access denied",
        statusCode: 403,
      });
    }

    next();
  };
};

export default issueDeleteAccess;
