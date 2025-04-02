const express = require('express');
const router = express.Router();
const quizSubmissionController = require('../controller/quizSubmissionController');
 
router.post('/quiz_submission/create', quizSubmissionController.addQuizSubmission);
router.get('/quiz_submission/all', quizSubmissionController.getAllQuizSubmissions);
router.get('/quiz_submission/:id', quizSubmissionController.getQuizSubmissionById);
router.put('/quiz_submission/update/:id', quizSubmissionController.editQuizSubmission);
router.delete('/quiz_submission/delete/:id', quizSubmissionController.deleteQuizSubmission);

module.exports = router;