import type { Request, Response } from "express";
import sendResponse from "../../utility/sendResponse";
import { issueService } from "./issue.service";

const createIssue = async (req: Request, res: Response) => {
  try {
    const result = await issueService.createNewIssue(req.body, req.user);

    sendResponse(res, {
      success: true,
      message: "Issue created successfully",
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

const getIssues = async (req: Request, res: Response) => {
  try {
    const { sort, type, status } = req.query;

    console.log(sort, type, status);

    const result = await issueService.getIssues(
      sort as string,
      type as string,
      status as string,
    );

    sendResponse(res, {
      success: true,
      message: "Issues retrieved successfully",
      statusCode: 200,
      data: result.rows,
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

export const issueController = { createIssue, getIssues };
