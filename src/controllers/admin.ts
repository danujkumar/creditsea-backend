import * as asyncHandler from "express-async-handler";
import { Request, Response } from "express";
import Loan from "../models/user"; 
import generateToken from "../utils/generateToken";

// Authenticate user
export const authUser = asyncHandler(async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const user = await Loan.findOne({ email });

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const token = generateToken(res, user._id);
    res.json({ token });
  } catch (err: any) {
    res.status(401).json({ error: err.message });
  }
});

// Apply for a loan
export const applyLoan = asyncHandler(async (req: Request, res: Response) => {
  try {
    const {
      fullname,
      loan_amount,
      tenure,
      employment_status,
      reason,
      address,
      allowed,
      email,
      repaid,
    } = req.body;

    const existingLoan = await Loan.findOne({ email });

    if (existingLoan) {
      res.status(400).json({
        success: false,
        message: "A loan has already been disbursed for this email.",
      });
      return;
    }

    const user = await Loan.create({
      fullname,
      loan_amount,
      tenure,
      employment_status,
      reason,
      address,
      allowed,
      email,
      repaid,
    });

    res.status(201).json({
      success: true,
      message: "Loan successfully applied.",
      user,
    });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

export const repaidLoans = asyncHandler(async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const user = await Loan.findOne({ email });

    if (!user) {
      res.status(404).json({
        success: false,
        message: "User with this email not found.",
      });
      return;
    }

    user.repaid = true;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Repaid status updated to true.",
      user,
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to update repaid status.",
      error,
    });
  }
});

// Get all loan profiles
export const getAllProfiles = asyncHandler(async (req: Request, res: Response) => {
  try {
    const users = await Loan.find({});

    if (users.length > 0) {
      res.status(200).json({ success: true, users });
    } else {
      res.status(404).json({ success: false, message: "No users found." });
    }
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to get users.", error });
  }
});

// Get loan statistics
export const getAllDetails = asyncHandler(async (req: Request, res: Response) => {
  try {
    const totalLoans = await Loan.countDocuments();
    const borrowers = await Loan.countDocuments({ repaid: false });
    const repaidLoans = await Loan.countDocuments({ repaid: true });
    const activeUsers = totalLoans;

    const cashDisbursedResult = await Loan.aggregate([
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$loan_amount" },
        },
      },
    ]);

    const cashDisbursed =
      cashDisbursedResult.length > 0 ? cashDisbursedResult[0].totalAmount : 0;

    res.status(200).json({
      success: true,
      insights: {
        totalLoans,
        borrowers,
        repaidLoans,
        activeUsers,
        cashDisbursed,
      },
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to get insights.", error });
  }
});