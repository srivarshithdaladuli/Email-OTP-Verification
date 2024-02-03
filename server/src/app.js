// Import required modules
const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const crypto = require('crypto');

// Create Express app
const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Store users and their OTPs
const users = {};

// Nodemailer setup
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: ' ', // Your Gmail email address
    pass: ' ' // Your Gmail password
  }
});

// Generate OTP function
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000);
};

// Endpoint to initiate email verification
app.post('/send-otp', (req, res) => {
  const { email } = req.body;

  // Generate OTP
  const otp = generateOTP();

  // Store user and OTP in-memory (You might want to use a database for production)
  users[email] = {
    otp,
    verified: false
  };

  // Email configuration
  const mailOptions = {
    from: 'test.world288@gmail.com', // Your Gmail email address
    to: email,
    subject: 'Email Verification OTP',
    text: `Your OTP for email verification is: ${otp}`
  };

  // Send email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error);
      return res.status(500).send('Failed to send OTP');
    }
    console.log('Email sent: ' + info.response);
    res.status(200).send('OTP sent successfully');
  });
});

// Endpoint to verify OTP
app.post('/verify-otp', (req, res) => {
  const { email, otp } = req.body;

  // Check if user exists
  if (!users[email]) {
    return res.status(400).send('User not found');
  }

  // Check if OTP is correct
  if (users[email].otp === parseInt(otp)) {
    // Mark user as verified
    users[email].verified = true;
    return res.status(200).send('OTP verified successfully');
  } else {
    return res.status(401).send('Invalid OTP');
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
