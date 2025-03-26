const express = require("express");

const router = express.Router();
const { 
    apply_loan,
    getAllProfiles,
    getAllDetails,
    repaidLoans
 } =require( '../../src/controllers/admin.js');

router.get('/getAll', getAllProfiles);
router.post('/apply', apply_loan);
router.get('/getDetails', getAllDetails);
router.post('/repaid', repaidLoans);

module.exports=router;