const asyncHandler = require("express-async-handler");
const Loan = require("../models/user.js");

const authUser = asyncHandler(async (req, res) => {
  try {
    if (!user) return res.status(404).json({ mssg: "Not found" });

    const token = generateToken(res, user._id);
    res.json({
      token,
    });
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
});

const apply_loan = asyncHandler(async (req, res) => {
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

    // Check if a loan already exists for this email
    const existingLoan = await Loan.findOne({ email });

    if (existingLoan) {
      return res.status(400).json({
        success: false,
        message: "A loan has already been disbursed for this email.",
      });
    }

    // Create a new loan
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
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});


const repaidLoans = asyncHandler(async (req, res) => {
  try {
    const { email } = req.body;

    const user = await Loan.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User with this email not found." });
    }

    user.repaid = true;
    await user.save();

    res
      .status(200)
      .json({
        success: true,
        message: "Repaid status updated to false.",
        user,
      });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({
        success: false,
        message: "Failed to update repaid status.",
        error,
      });
  }
});

const getAllProfiles = asyncHandler(async (req, res) => {
  try {
    // Fetch all users from the database
    const users = await Loan.find({});

    if (users.length > 0) {
      res.status(200).json({ success: true, users });
    } else {
      res.status(404).json({ success: false, message: "No users found." });
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Failed to get users.", error });
  }
});

const getAllDetails = asyncHandler(async (req, res) => {
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
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Failed to get insights.", error });
  }
});

module.exports = { authUser, apply_loan, getAllProfiles, getAllDetails, repaidLoans };
