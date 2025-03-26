const mongoose = require('mongoose');

const loanSchema = new mongoose.Schema({
    fullname: { type: String, required: true },
    loan_amount: { type: Number, required: true },
    tenure: { type: Number, required: true },
    employment_status: { type: String, required: true, enum: ['employed', 'self-employed', 'unemployed'] },
    reason: { type: String, required: true },
    address: { type: String, required: true },
    allowed: { type: Boolean, default: false },
    repaid: { type: Boolean, default: false },
    email: { type: String, required: true, unique: true, lowercase: true },
    date: { 
        type: String, 
        default: () => new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) 
    },
    time: { 
        type: String, 
        default: () => new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }) 
    }
}, { timestamps: true });

const Loan = mongoose.model('Loan', loanSchema);

module.exports = Loan;