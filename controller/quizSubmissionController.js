const QuizSubmission = require('../model/quizSubmission.js');
const User = require('../model/user.js');
const Quiz = require('../model/quiz.js');

// Add new quiz submission
exports.addQuizSubmission = async (req, res) => {
    try {
        const submission = await QuizSubmission.create(req.body);
        res.status(201).json({
            status: 'success',
            data: submission
        });
    } catch (error) {
        res.status(400).json({
            status: 'error',
            message: error.message
        });
    }
};

// Get all quiz submissions with user and quiz details
exports.getAllQuizSubmissions = async (req, res) => {
    try {
        const submissions = await QuizSubmission.findAll({
            include: [
                { model: User, attributes: ['username', 'email'] },
                { model: Quiz, attributes: ['quiz_title'] }
            ]
        });
        res.status(200).json({
            status: 'success',
            data: submissions
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};

// Get quiz submission by ID
exports.getQuizSubmissionById = async (req, res) => {
    try {
        const submission = await QuizSubmission.findOne({
            where: { id: req.params.id },
            include: [
                { model: User, attributes: ['username', 'email'] },
                { model: Quiz, attributes: ['quiz_title'] }
            ]
        });
        
        if (!submission) {
            return res.status(404).json({
                status: 'error',
                message: 'Quiz submission not found'
            });
        }

        res.status(200).json({
            status: 'success',
            data: submission
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};

// Update quiz submission
exports.editQuizSubmission = async (req, res) => {
    try {
        const submission = await QuizSubmission.findOne({
            where: { id: req.params.id }
        });

        if (!submission) {
            return res.status(404).json({
                status: 'error',
                message: 'Quiz submission not found'
            });
        }

        await submission.update(req.body);
        
        res.status(200).json({
            status: 'success',
            data: submission
        });
    } catch (error) {
        res.status(400).json({
            status: 'error',
            message: error.message
        });
    }
};

// Delete quiz submission
exports.deleteQuizSubmission = async (req, res) => {
    try {
        const submission = await QuizSubmission.findOne({
            where: { id: req.params.id }
        });

        if (!submission) {
            return res.status(404).json({
                status: 'error',
                message: 'Quiz submission not found'
            });
        }

        await submission.destroy();
        
        res.status(200).json({
            status: 'success',
            message: 'Quiz submission deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};
