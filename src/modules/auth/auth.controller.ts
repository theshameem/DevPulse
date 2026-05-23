import type { Request, Response } from "express";
import sendResponse from "../../utility/sendResponse";
import { authService } from "./auth.service";

const signupUser = async (req: Request, res: Response) => {
  try {
    const result = await authService.createUser(req.body);

    sendResponse(res, {
      success: true,
      message: "User registered successfully",
      data: result.rows[0],
      statusCode: 200,
    });
  } catch (error: any) {
    sendResponse(res, {
      success: false,
      message: error.message,
      error: error,
      statusCode: 500,
    });
  }
};

const loginUser = async (req: Request, res: Response) => {
  try {
    const result = await authService.loginUser(req.body);

    sendResponse(res, {
      success: true,
      message: "User logged in successfully.",
      data: result,
      statusCode: 200,
    });
  } catch (error: any) {
    sendResponse(res, {
      success: false,
      message: error.message,
      error: error,
      statusCode: 500,
    });
  }
};

export const authController = {
  signupUser,
  loginUser,
};
