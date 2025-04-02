const express = require('express');
const router = express.Router();
const coursePorgressController = require('../controller/courseProgressController');
 
router.post('/course_progress/create', coursePorgressController.addCourseProgress);
router.get('/course_progress/all', coursePorgressController.getAllCourseProgress);
router.get('/course_progress/:id', coursePorgressController.getCourseProgressById);
router.put('/course_progress/update/:id', coursePorgressController.updateCourseProgress);
router.delete('/course_progress/delete/:id', coursePorgressController.deleteCourseProgress);

module.exports = router;