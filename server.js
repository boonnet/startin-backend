const express = require('express');
const cors = require('cors');
const session = require('express-session');
const db = require('./config/db');
require('dotenv').config();
const path = require('path');
const fs = require('fs');
const app = express();
app.use(express.json());
app.use(cors());

// Ensure 'uploads' directory exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log('uploads directory created');
}

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static(uploadDir));

app.use(
  session({
    secret: process.env.ACCESS_SECRET_TOKEN,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
  })
);

(async () => {
    await db.sync();
    console.log("Tables created successfully");
})();


// Root route
const nodemailer = require('nodemailer');
app.use('/test', async (req,res) => {
  const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: 'vinothini1.deecodes@gmail.com',
        pass: 'fksv xyol plxg gcsv',
      },
    });
    const mailOptions = {
      from: 'vinothini1.deecodes@gmail.com',
      to: 'vinothinivm31@gmail.com',
      subject: "Account approved in eNOOL",
      text: `
         Hi,
         Welcome to Our Platform!
         Your account has been successfully approved, your registration link
         Warm regards,
         eNOOL Team`
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        console.error(error);
        return res.status(500).send('Failed to send email');
    }

    console.log('Email sent: ' + info.response);
    res.status(200).send('Author approved and email sent successfully');
});
})
// Post route
app.post('/', (req, res) => {
  res.send('Post request submitted');
});

//Admin Route
const adminRoutes = require('./routes/adminRoutes');
app.use('/api', adminRoutes);

//User Route
const userRoutes = require('./routes/userRoutes');
app.use('/api', userRoutes);

//Category Route
const categoryRoutes = require('./routes/categoryRoutes');
app.use('/api', categoryRoutes);

//SubCategory Route
const subCategoryRoutes = require('./routes/subCategoryRoutes');
app.use('/api', subCategoryRoutes);

//Settings Route
const settingsRoutes = require('./routes/settingsRoutes');
app.use('/api', settingsRoutes);

//SubCategory Route
const courseRoutes = require('./routes/courseRoutes');
app.use('/api', courseRoutes);

//Templetes Route
const templetesRoutes = require('./routes/templatesRoutes');
app.use('/api', templetesRoutes);

//Certifications Route
const certificationsRoute = require('./routes/certificationsRoute');
app.use('/api', certificationsRoute);

//Subscription Route
const subscriptionRoutes = require('./routes/subscriptionRoutes');
app.use('/api', subscriptionRoutes);

//Enrollment Route
const enrollmentRoutes = require('./routes/enrollmentRoutes');
app.use('/api', enrollmentRoutes);

//Rating Route
const ratingRoutes = require('./routes/ratingRoutes');
app.use('/api', ratingRoutes);

//Notification Route
const notificationRoutes = require('./routes/notificationRoutes');
app.use('/api', notificationRoutes);

//Course Progress Route
const courseProgressRoutes = require('./routes/courseProgressRoutes');
app.use('/api', courseProgressRoutes);

//Quiz Submission Route
const quizSubmissionRoutes = require('./routes/quizSubmissionRoutes');
app.use('/api', quizSubmissionRoutes);

// After importing all models
const Templates = require('./model/templates');
// Initialize associations
Templates.setupAssociations();

//Favorites Route
const favoritesRoutes = require('./routes/favoritesRoutes');
app.use('/api', favoritesRoutes);

// Listen on the port from the .env file
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`:rocket: Server is running on port ${PORT}`);
});