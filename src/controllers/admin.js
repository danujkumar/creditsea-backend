const asyncHandler=require("express-async-handler")
const Loan = require("../models/user.js")

const authUser = asyncHandler(async (req,res)=>{
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
      const { fullname, loan_amount, tenure, employment_status, reason, address, allowed, email  } = req.body;
      const user = await Loan.create({
        fullname,
        loan_amount,
        tenure,
        employment_status,
        reason,
        address,
        allowed,
        email
      });
      res.status(201).json({
        user
      });
    } catch (err) {
      res.status(400).json({ error: err.message });
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
    res.status(500).json({ success: false, message: "Failed to get users.", error });
  }
});

const getAllDetails = asyncHandler(async (req, res)=>{
  try {

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
})

module.exports={authUser, apply_loan, getAllProfiles, getAllDetails}