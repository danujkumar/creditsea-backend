import * as express from "express";
// import * as asyncHandler from "express-async-handler";

import { 
    applyLoan, 
    getAllProfiles, 
    getAllDetails, 
    repaidLoans 
} from "../../src/controllers/admin";

const router = express.Router();

router.get("/getAll", getAllProfiles);
router.post("/apply", applyLoan);
router.get("/getDetails", getAllDetails);
router.post("/repaid", repaidLoans);

export default router;
