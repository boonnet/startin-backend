const CourseProgress = require('../model/courseProgress.js');

// Add new course progress
const addCourseProgress = async (req, res) => {
    try {
        const { user_id, course_id, lession_id } = req.body;

        // Validate required fields
        if (!user_id || !course_id || !lession_id) {
            return res.status(400).json({
                success: false,
                message: "user_id, course_id, and lession_id are required fields"
            });
        }

        // Check if entry already exists
        const existingProgress = await CourseProgress.findOne({
            where: {
                user_id,
                course_id,
                lession_id
            }
        });

        if (existingProgress) {
            return res.status(409).json({
                success: false,
                message: "Course progress already exists for this user, course, and lesson"
            });
        }

        // Create new progress entry with default values
        const courseProgress = await CourseProgress.create({
            user_id,
            course_id,
            lession_id,
            // These will use the default values from the model
            status: 'not_started',
            progress_percentage: 0,
            last_accessed_at: new Date()
        });

        res.status(201).json({
            success: true,
            message: "Course progress added successfully",
            data: courseProgress
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get all course progress records
const getAllCourseProgress = async (req, res) => {
    try {
        const courseProgress = await CourseProgress.findAll({
            include: ['User', 'Course', 'Lession']
        });

        res.status(200).json({
            success: true,
            data: courseProgress
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get course progress by ID
const getCourseProgressById = async (req, res) => {
    try {
        const { id } = req.params;
        const courseProgress = await CourseProgress.findOne({
            where: { id },
            include: ['User', 'Course', 'Lession']
        });

        if (!courseProgress) {
            return res.status(404).json({
                success: false,
                message: "Course progress not found"
            });
        }

        res.status(200).json({
            success: true,
            data: courseProgress
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Update course progress
const updateCourseProgress = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, progress_percentage } = req.body;

        const courseProgress = await CourseProgress.findByPk(id);

        if (!courseProgress) {
            return res.status(404).json({
                success: false,
                message: "Course progress not found"
            });
        }

        await courseProgress.update({
            status,
            progress_percentage,
            last_accessed_at: new Date()
        });

        res.status(200).json({
            success: true,
            message: "Course progress updated successfully",
            data: courseProgress
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Delete course progress
const deleteCourseProgress = async (req, res) => {
    try {
        const { id } = req.params;
        const courseProgress = await CourseProgress.findByPk(id);

        if (!courseProgress) {
            return res.status(404).json({
                success: false,
                message: "Course progress not found"
            });
        }

        await courseProgress.destroy();

        res.status(200).json({
            success: true,
            message: "Course progress deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    addCourseProgress,
    getAllCourseProgress,
    getCourseProgressById,
    updateCourseProgress,
    deleteCourseProgress
};
