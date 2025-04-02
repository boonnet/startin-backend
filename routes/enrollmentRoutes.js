const express = require('express');
const router = express.Router();
const enrollmentController = require('../controller/enrollmentController');

// Add new enrollment
router.post('/enrollment/add', enrollmentController.addEnrollment);

// Check if user is enrolled in a template (specific route first)
router.get('/enrollment/check', enrollmentController.checkEnrollment);

router.get('/enrollment/course/check', enrollmentController.checkCourseEnrollment);

// Get all enrollments
router.get('/enrollment/all', enrollmentController.getEnrollments);

// Get enrollment by ID (generic pattern after specific routes)
router.get('/enrollment/:id', enrollmentController.getEnrollmentById);

// Update enrollment
router.put('/enrollment/update/:id', enrollmentController.editEnrollment);

// Delete enrollment
router.delete('/enrollment/delete/:id', enrollmentController.deleteEnrollment);

module.exports = router;