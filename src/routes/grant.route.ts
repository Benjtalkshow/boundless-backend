import { Router } from "express";
import { body } from "express-validator";
import {
  createGrant,
  updateGrantStatus,
} from "../controllers/grant.controller";
import { protect } from "../middleware/auth";
import { validateRequest } from "../middleware/validateRequest";

const router = Router();

// Validation schema for grant creation
const createGrantSchema = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ max: 200 })
    .withMessage("Title cannot exceed 200 characters"),
  body("description")
    .trim()
    .notEmpty()
    .withMessage("Description is required")
    .isLength({ max: 5000 })
    .withMessage("Description cannot exceed 5000 characters"),
  body("totalBudget")
    .isFloat({ min: 1 })
    .withMessage("Total budget must be a positive number"),
  body("rules")
    .trim()
    .notEmpty()
    .withMessage("Rules are required")
    .isLength({ max: 2000 })
    .withMessage("Rules cannot exceed 2000 characters"),
  body("milestones")
    .isArray({ min: 1 })
    .withMessage("At least one milestone is required"),
  body("milestones.*.title")
    .trim()
    .notEmpty()
    .withMessage("Milestone title is required")
    .isLength({ max: 100 })
    .withMessage("Milestone title cannot exceed 100 characters"),
  body("milestones.*.description")
    .trim()
    .notEmpty()
    .withMessage("Milestone description is required")
    .isLength({ max: 500 })
    .withMessage("Milestone description cannot exceed 500 characters"),
  body("milestones.*.expectedPayout")
    .isFloat({ min: 0 })
    .withMessage("Expected payout must be a non-negative number"),
];

// POST /api/grants - Create a new grant
router.post("/", protect, validateRequest(createGrantSchema), createGrant);

// Validation schema for grant status update
const updateGrantStatusSchema = [
  body("status")
    .isIn(["open", "closed"])
    .withMessage("Status must be either 'open' or 'closed'"),
];

// PATCH /api/grants/:id/status - Update grant status
router.patch(
  "/:id/status",
  protect,
  validateRequest(updateGrantStatusSchema),
  updateGrantStatus,
);

export default router;
