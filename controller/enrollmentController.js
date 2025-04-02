const Enrollment = require('../model/enrollment.js');
const User = require('../model/user.js');
const Course = require('../model/course.js');
const Templates = require('../model/templates.js');
const Lession = require('../model/lessions.js');
const Quiz = require('../model/quiz.js');
const Questions = require('../model/questions.js');
const Rating = require('../model/ratings.js');
const CourseProgress = require('../model/courseProgress.js');
const cron = require('node-cron')
const { Op, where } = require('sequelize');
// Add new enrollment
const addEnrollment = async (req, res) => {
    try {
        let courseTitle = null;
        let courseValidity = null;
        let course = null;
        
        // Only look up course if course_id is provided
        if (req.body.course_id) {
            // First find the course to get validity information
            course = await Course.findByPk(req.body.course_id, {
                include: [
                    {
                        model: Lession,
                        as: 'Lessions'  // Changed from 'lessions' to 'Lessions' to match the association
                    }
                ]
            });
            
            if (!course) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Course not found'
                });
            }
            
            courseTitle = course.course_title;
            courseValidity = course.validity_days; // Changed from validity to validity_days to match the model
        }

        // Check if user exists
        const user = await User.findByPk(req.body.user_id);
        if (!user) {
            return res.status(404).json({
                status: 'error',
                message: 'User not found'
            });
        }

        // Check if template exists if template_id is provided
        if (req.body.template_id) {
            const template = await Templates.findByPk(req.body.template_id);
            if (!template) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Template not found'
                });
            }
        }

        // Check if user is already enrolled in this template or course
        const existingEnrollment = await Enrollment.findOne({
            where: {
                user_id: req.body.user_id,
                ...(req.body.template_id ? { template_id: req.body.template_id } : {}),
                ...(req.body.course_id ? { course_id: req.body.course_id } : {}),
                status: 'active'
            }
        });

        if (existingEnrollment) {
            return res.status(400).json({
                status: 'error',
                message: 'User is already enrolled in this template or course'
            });
        }

        // Create enrollment with provided dates
        const enrollment = await Enrollment.create({
            user_id: req.body.user_id,
            course_id: req.body.course_id || null,
            template_id: req.body.template_id || null,
            enrollment_date: req.body.enrollment_date || new Date(),
            expiry_date: req.body.expiry_date,
            status: 'active'
        });

        // Create course progress entries for all lessons of the enrolled course
        if (course && course.Lessions && course.Lessions.length > 0) {  // Changed from lessons to Lessions
            // Create progress entries for all lessons
            const progressEntries = course.Lessions.map(lesson => ({  // Changed from lessons to Lessions
                user_id: req.body.user_id,
                course_id: req.body.course_id,
                lession_id: lesson.id,
                status: 'not_started',
                progress_percentage: 0,
                last_accessed_at: new Date()
            }));

            // Bulk create all progress entries
            await CourseProgress.bulkCreate(progressEntries);
        }

        // Return response with enrollment details
        res.status(201).json({
            status: 'success',
            data: {
                ...enrollment.toJSON(),
                course_title: courseTitle,
                validity: courseValidity
            },
            message: course && course.Lessions ? 
                    `Enrollment created with ${course.Lessions.length} lesson progress entries` : 
                    'Enrollment created successfully'
        });

    } catch (error) {
        console.error("Enrollment error:", error);
        res.status(400).json({
            status: 'error',
            message: error.message
        });
    }
};

// Get all enrollments with user, course, and template details
const getEnrollments = async (req, res) => {
    try {
        const enrollments = await Enrollment.findAll({
            include: [
                {
                    model: User,
                    attributes: ['uid', 'username', 'email']
                },
                {
                    model: Course,
                    attributes: ['id', 'course_title', 'course_description', 'parent_category', 'sub_category', 'course_image', 'time_spend', 'course_level'],
                    include: [
                        {
                            model: Lession,
                            include: [
                                {
                                    model: Quiz,
                                    include: [{ model: Questions }]
                                }
                            ]
                        },
                        {
                            model: Rating,
                            attributes: ['rating', 'review']
                        }
                    ]
                },
                {
                    model: Templates,
                    attributes: ['id', 'template_name', 'description', 'files','cover_image','price']
                }
            ]
        });
        res.status(200).json({
            status: 'success',
            data: enrollments
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};

// Get enrollment by ID
const getEnrollmentById = async (req, res) => {
    try {
        const enrollment = await Enrollment.findOne({
            where: { id: req.params.id },
            include: [
                {
                    model: User,
                    attributes: ['uid', 'username', 'email']
                },
                {
                    model: Course,
                    attributes: ['id', 'course_title', 'course_description', 'parent_category', 'sub_category', 'course_image', 'time_spend', 'course_level'],
                    include: [
                        {
                            model: Lession,
                            include: [
                                {
                                    model: Quiz,
                                    include: [{ model: Questions }]
                                }
                            ]
                        },
                        {
                            model: Rating,
                            attributes: ['rating', 'review']
                        }
                    ]
                },
                {
                    model: Templates,
                    attributes: ['id', 'template_name', 'description', 'files']
                }
            ]
        });

        if (!enrollment) {
            return res.status(404).json({
                status: 'error',
                message: 'Enrollment not found'
            });
        }

        res.status(200).json({
            status: 'success',
            data: enrollment
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};

// Update enrollment
const editEnrollment = async (req, res) => {
    try {
        const enrollment = await Enrollment.findOne({
            where: { id: req.params.id }
        });

        if (!enrollment) {
            return res.status(404).json({
                status: 'error',
                message: 'Enrollment not found'
            });
        }

        // If course_id is being updated, check if course exists
        if (req.body.course_id) {
            const course = await Course.findByPk(req.body.course_id);
            if (!course) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Course not found'
                });
            }
        }

        // If template_id is being updated, check if template exists
        if (req.body.template_id) {
            const template = await Templates.findByPk(req.body.template_id);
            if (!template) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Template not found'
                });
            }
        }

        await enrollment.update(req.body);
        
        res.status(200).json({
            status: 'success',
            data: enrollment
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};

// Delete enrollment
const deleteEnrollment = async (req, res) => {
    try {
        const enrollment = await Enrollment.findOne({
            where: { id: req.params.id }
        });

        if (!enrollment) {
            return res.status(404).json({
                status: 'error',
                message: 'Enrollment not found'
            });
        }

        await enrollment.destroy();
        
        res.status(200).json({
            status: 'success',
            message: 'Enrollment deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};

// Check if user is enrolled in a template
// API Route: /api/enrollment/check
const checkEnrollment = async (req, res) => {
    try {
        const { user_id, template_id } = req.query;
        
        const enrollment = await Enrollment.findOne({
            where: {
                user_id,
                template_id,
                status: 'active'
            }
        });
        
        return res.status(200).json({
            status: 'success',
            isEnrolled: !!enrollment, // This is what your frontend is checking
            data: enrollment || null
        });
    } catch (error) {
        return res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};

const checkCourseEnrollment = async (req, res) => {
    try {
        const { user_id, course_id } = req.query;
        
        const enrollment = await Enrollment.findOne({
            where: {
                user_id,
                course_id,
                status: 'active'
            }
        });
        
        return res.status(200).json({
            status: 'success',
            isEnrolled: !!enrollment, // This is what your frontend is checking
            data: enrollment || null
        });
    } catch (error) {
        return res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};



cron.schedule('* * * * *', async () => {
    try {
        // Get all enrollments where the expiry_date is in the past and status is still active
        const expiredEnrollments = await Enrollment.findAll({
            where: {
                status: 'active',
                expiry_date: {
                    [Op.lt]: new Date() // Finds enrollments where expiry_date is less than the current date
                }
            }
        });
        if (expiredEnrollments.length > 0) {
            // Delete the expired enrollments
            await Enrollment.destroy({
                where: {
                    id: expiredEnrollments.map(enrollment => enrollment.id)
                }
            });
            await CourseProgress.destroy({
                where:{
                    course_id: expiredEnrollments.map(enrollment => enrollment.course_id)
                }
            })
            console.log(`${expiredEnrollments.length} expired enrollments deleted.`);
        } else {
            // Log a message if no expired enrollments were found
            console.log('No expired enrollments found.');
        }
    } catch (error) {
        console.error('Error checking for expired enrollments:', error.message);
    }
});

module.exports = {
    addEnrollment,
    getEnrollments,
    getEnrollmentById,
    editEnrollment,
    deleteEnrollment,
    checkEnrollment,
    checkCourseEnrollment
};