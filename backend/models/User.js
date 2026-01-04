const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
name: String,
phone: String,
place: String,
district: String,
otp: String,
isVerified: { type: Boolean, default: false },
});


module.exports = mongoose.model('User', userSchema);