const Favorites = require('../model/favorites.js');
const User = require('../model/user.js');
const Course = require('../model/course.js');
const Lesson = require('../model/lessions.js');
const Quiz = require('../model/quiz.js');
const Questions = require('../model/questions.js');
const Rating = require('../model/ratings.js');
const Templates = require('../model/templates.js');

// Add a favorite
const addFavorite = async (req, res) => {
    try {
        const { user_id, course_id, template_id } = req.body;
        
        // Check if user exists
        const user = await User.findByPk(user_id);
        if (!user) {
            return res.status(404).json({
                status: 'error',
                message: 'User not found'
            });
        }

        // Check if course exists if course_id is provided
        if (course_id) {
            const course = await Course.findByPk(course_id);
            if (!course) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Course not found'
                });
            }
        }

        // Check if template exists if template_id is provided
        if (template_id) {
            const template = await Templates.findByPk(template_id);
            if (!template) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Template not found'
                });
            }
        }

        // Check if either course_id or template_id is provided
        if (!course_id && !template_id) {
            return res.status(400).json({
                status: 'error',
                message: 'Either course_id or template_id must be provided'
            });
        }

        // Check if the favorite already exists
        const existingFavorite = await Favorites.findOne({
            where: {
                user_id,
                ...(course_id ? { course_id } : {}),
                ...(template_id ? { template_id } : {})
            }
        });

        if (existingFavorite) {
            return res.status(400).json({
                status: 'error',
                message: 'This item is already in favorites'
            });
        }

        // Create the favorite
        const favorite = await Favorites.create({ 
            user_id, 
            course_id: course_id || null, 
            template_id: template_id || null 
        });
        
        res.status(201).json({
            status: 'success',
            data: favorite
        });
    } catch (error) {
        res.status(500).json({ 
            status: 'error',
            message: error.message 
        });
    }
};

// Get all favorites with associated Course/Template and User
const getFavorites = async (req, res) => {
    try {
        const favorites = await Favorites.findAll({
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
                            model: Lesson,
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
                    attributes: ['id', 'template_name', 'description', 'files', 'cover_image', 'price']
                }
            ]
        });
        res.status(200).json({
            status: 'success',
            data: favorites
        });
    } catch (error) {
        res.status(500).json({ 
            status: 'error',
            message: error.message 
        });
    }
};

// Get a favorite by ID
const getFavoriteById = async (req, res) => {
    try {
        const favorite = await Favorites.findOne({
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
                            model: Lesson,
                            include: [
                                {
                                    model: Quiz,
                                    include: [{ model: Questions }]
                                },
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
                    attributes: ['id', 'template_name', 'description', 'files', 'cover_image', 'price']
                }
            ]
        });

        if (!favorite) {
            return res.status(404).json({
                status: 'error',
                message: 'Favorite not found'
            });
        }

        res.status(200).json({
            status: 'success',
            data: favorite
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};

// Edit a favorite
const editFavorite = async (req, res) => {
    try {
        const { id } = req.params;
        const { user_id, course_id, template_id } = req.body;
        
        const favorite = await Favorites.findByPk(id);
        if (!favorite) {
            return res.status(404).json({ 
                status: 'error',
                message: 'Favorite not found' 
            });
        }

        // Check if user exists if user_id is provided
        if (user_id) {
            const user = await User.findByPk(user_id);
            if (!user) {
                return res.status(404).json({
                    status: 'error',
                    message: 'User not found'
                });
            }
        }

        // Check if course exists if course_id is provided
        if (course_id) {
            const course = await Course.findByPk(course_id);
            if (!course) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Course not found'
                });
            }
        }

        // Check if template exists if template_id is provided
        if (template_id) {
            const template = await Templates.findByPk(template_id);
            if (!template) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Template not found'
                });
            }
        }

        // Update the favorite
        await favorite.update({
            user_id: user_id || favorite.user_id,
            course_id: course_id !== undefined ? course_id : favorite.course_id,
            template_id: template_id !== undefined ? template_id : favorite.template_id
        });
        
        res.status(200).json({
            status: 'success',
            data: favorite
        });
    } catch (error) {
        res.status(500).json({ 
            status: 'error',
            message: error.message 
        });
    }
};

// Delete a favorite
const deleteFavorite = async (req, res) => {
    try {
        const { id } = req.params;
        const favorite = await Favorites.findByPk(id);
        
        if (!favorite) {
            return res.status(404).json({ 
                status: 'error',
                message: 'Favorite not found' 
            });
        }
        
        await favorite.destroy();
        res.status(200).json({ 
            status: 'success',
            message: 'Favorite deleted successfully' 
        });
    } catch (error) {
        res.status(500).json({ 
            status: 'error',
            message: error.message 
        });
    }
};

// Check if user has favorited a course
const checkCourseFavorite = async (req, res) => {
    try {
        const { user_id, course_id } = req.query;
        
        const favorite = await Favorites.findOne({
            where: {
                user_id,
                course_id
            }
        });
        
        return res.status(200).json({
            status: 'success',
            isFavorite: !!favorite,
            data: favorite || null
        });
    } catch (error) {
        return res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};

// Check if user has favorited a template
const checkTemplateFavorite = async (req, res) => {
    try {
        const { user_id, template_id } = req.query;
        
        const favorite = await Favorites.findOne({
            where: {
                user_id,
                template_id
            }
        });
        
        return res.status(200).json({
            status: 'success',
            isFavorite: !!favorite,
            data: favorite || null
        });
    } catch (error) {
        return res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};

module.exports = {
    addFavorite,
    getFavorites,
    getFavoriteById,
    editFavorite,
    deleteFavorite,
    checkCourseFavorite,
    checkTemplateFavorite
};