const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const app = express();

// Middleware to parse JSON data
app.use(bodyParser.json());

// Email configuration
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'your_email@gmail.com', // Your email
        pass: 'your_password' // Your email password
    }
});

// API endpoint to handle email sending
app.post('/send-email', (req, res) => {
    const { name, email, message } = req.body;

    // Email to user
    const userMailOptions = {
        from: 'your_email@gmail.com',
        to: email,
        subject: 'Thank You',
        text: `Dear ${name},\n\nThank you for submitting the form.\n\nYour Message: ${message}`
    };

    // Email to admin
    const adminMailOptions = {
        from: 'your_email@gmail.com',
        to: 'khadijanaqvi000@gmail.com', // Admin email
        subject: 'User Logged In',
        text: `${name} (${email}) has logged in.\n\nMessage: ${message}`
    };

    // Send email to user
    transporter.sendMail(userMailOptions, (error, info) => {
        if (error) {
            console.log('Error sending email to user:', error);
            return res.status(500).send('Failed to send email to user.');
        }
        console.log('Email sent to user:', info.response);

        // Send email to admin
        transporter.sendMail(adminMailOptions, (error, info) => {
            if (error) {
                console.log('Error sending email to admin:', error);
                return res.status(500).send('Failed to send email to admin.');
            }
            console.log('Email sent to admin:', info.response);
            res.status(200).send('Emails sent successfully!');
        });
    });
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});