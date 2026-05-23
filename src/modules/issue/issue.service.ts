import { pool } from "../../db";
import type { Issue } from "./issue.interface";

const createNewIssue = async (payload: Issue, user: any) => {
  const { title, description, type, status } = payload;

  console.log("inside service", user);

  const result = await pool.query(
    `
        INSERT INTO issues(title, description, type, status, reporter_id)
        VALUES($1, $2, $3, COALESCE($4, 'open'), $5)
        RETURNING *
        `,
    [title, description, type, status, user.id],
  );

  return result;
};

export const issueService = { createNewIssue };
