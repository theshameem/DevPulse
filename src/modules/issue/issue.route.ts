import { Router } from "express";
import auth from "../../middleware/auth";
import issueDeleteAccess from "../../middleware/issue-delete-access";
import issueUpdateAccess from "../../middleware/issue-update-access";
import { issueController } from "./issue.controller";

const router = Router();

router.post("/", auth(), issueController.createIssue);
router.get("/", issueController.getIssues);
router.get("/:id", issueController.getIssueById);
router.patch("/:id", auth(), issueUpdateAccess(), issueController.updateIssue);
router.delete("/:id", auth(), issueDeleteAccess(), issueController.deleteIssue);

export const issueRouter = router;
