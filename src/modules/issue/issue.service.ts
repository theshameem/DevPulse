import { pool } from "../../db";
import type { Issue } from "./issue.interface";

const createNewIssue = async (payload: Issue, user: { id: string }) => {
  const { title, description, type, status } = payload;

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

const getIssues = async (sort: string, type: string, status: string) => {
  const values: string[] = [];
  const whereClauses: string[] = [];

  // filter by type
  if (type) {
    values.push(type);
    whereClauses.push(`i.type = $${values.length}`);
  }

  // filter by status
  if (status) {
    values.push(status);
    whereClauses.push(`i.status = $${values.length}`);
  }

  // setup WHERE clause
  const whereSQL =
    whereClauses.length > 0 ? `WHERE ${whereClauses.join(" AND ")}` : "";

  // setup sort logic
  let orderBy = `ORDER BY i.created_at DESC`;

  if (sort === "oldest") {
    orderBy = `ORDER BY i.created_at ASC`;
  }

  const result = await pool.query(
    `
		SELECT 
		i.id,
		i.title,
		i.description,
		i.type,
		i.status,

		json_build_object(
			'id', u.id,
			'name', u.name,
			'role', u.role
		) AS reporter,

		i.created_at,
		i.updated_at

		FROM issues i
		JOIN users u ON i.reporter_id = u.id
		${whereSQL}
		${orderBy}
		`,
    values,
  );

  return result;
};

const getIssueById = async (id: string) => {
  const result = await pool.query(
    `
    SELECT 
    i.id,
    i.title,
    i.description,
    i.type,
    i.status,
    json_build_object(
      'id', u.id,
      'name', u.name,
      'role', u.role
    ) AS reporter,
    i.created_at,
    i.updated_at
    FROM issues i
    JOIN users u ON i.reporter_id = u.id
    WHERE i.id = $1
    `,
    [id],
  );

  return result;
};

const updateIssue = async (id: string, payload: Issue) => {
  const { title, description, type, status } = payload;

  const result = await pool.query(
    `
    UPDATE issues
    SET 
      title = $1,
      description = $2,
      type = $3,
      status = COALESCE($4, status),
      updated_at = NOW()
    WHERE id = $5
    RETURNING *
    `,
    [title, description, type, status, id],
  );

  return result;
};

const deleteIssue = async (id: string) => {
  const result = await pool.query(
    `
    DELETE FROM issues
    WHERE id = $1
    RETURNING *
    `,
    [id],
  );

  return result;
};

export const issueService = {
  createNewIssue,
  getIssues,
  getIssueById,
  updateIssue,
  deleteIssue,
};
