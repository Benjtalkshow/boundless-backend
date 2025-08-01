import { Request, Response } from "express";
import Milestone from "../models/milestone.model";
import { triggerSorobanPayout } from "../services/contract.service";

export const reviewMilestone = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status, adminNote } = req.body;

  try {
    const milestone = await Milestone.findById(id);
    if (!milestone) {
      res.status(404).json({ message: "Milestone not found" });
      return;
    }

    if (status === "approved") {
      milestone.status = "approved";
      if (adminNote) milestone.adminNote = adminNote;
      await milestone.save();
      // Trigger Soroban payout asynchronously
      triggerSorobanPayout(milestone).catch((err) => {
        // Log error, but don't block response
        console.error("Soroban payout error:", err);
      });
      res.json({ message: "Milestone approved and payout triggered" });
    } else if (status === "rejected") {
      milestone.status = "revision-requested";
      if (adminNote) milestone.adminNote = adminNote;
      await milestone.save();
      res.json({
        message: "Milestone status set to revision-requested",
      });
    } else {
      res.status(400).json({ message: "Invalid status value" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
