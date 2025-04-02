const Rating = require('../model/ratings.js');
const Course = require('../model/course.js');
const User = require('../model/user.js');

// Add new rating
const addRating = async (req, res) => {
    try {
        const { course_id, user_id, review, rating } = req.body;

        // Check if user has already rated this course
        const existingRating = await Rating.findOne({
            where: {
                course_id: course_id,
                user_id: user_id
            }
        });

        if (existingRating) {
            return res.status(400).json({ msg: "You have already rated this course" });
        }

        const newRating = await Rating.create({
            course_id,
            user_id,
            review,
            rating
        });

        res.status(201).json({
            msg: "Rating added successfully",
            data: newRating
        });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

// Get all ratings
const getRatings = async (req, res) => {
    try {
        const ratings = await Rating.findAll({
            include: [
                {
                    model: User,
                    attributes: ['username', 'profile_image']
                },
                {
                    model: Course,
                    attributes: ['course_title']
                }
            ]
        });
        res.status(200).json(ratings);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

// Get rating by ID
const getRatingById = async (req, res) => {
    try {
        const rating = await Rating.findOne({
            where: {
                id: req.params.id
            },
            include: [
                {
                    model: User,
                    attributes: ['username', 'profile_image']
                },
                {
                    model: Course,
                    attributes: ['course_title']
                }
            ]
        });

        if (!rating) {
            return res.status(404).json({ msg: "Rating not found" });
        }

        res.status(200).json(rating);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

// Edit rating
const editRating = async (req, res) => {
    try {
        const { review, rating } = req.body;
        const ratingId = req.params.id;

        const existingRating = await Rating.findByPk(ratingId);

        if (!existingRating) {
            return res.status(404).json({ msg: "Rating not found" });
        }

        // Check if the user owns this rating (assuming user_id is available in req.user)
        if (existingRating.user_id !== req.user.uid) {
            return res.status(403).json({ msg: "Not authorized to edit this rating" });
        }

        await Rating.update({
            review,
            rating
        }, {
            where: {
                id: ratingId
            }
        });

        res.status(200).json({ msg: "Rating updated successfully" });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

// Delete rating
const deleteRating = async (req, res) => {
    try {
        const ratingId = req.params.id;
        const rating = await Rating.findByPk(ratingId);

        if (!rating) {
            return res.status(404).json({ msg: "Rating not found" });
        }

        // Check if the user owns this rating (assuming user_id is available in req.user)
        if (rating.user_id !== req.user.uid) {
            return res.status(403).json({ msg: "Not authorized to delete this rating" });
        }

        await Rating.destroy({
            where: {
                id: ratingId
            }
        });

        res.status(200).json({ msg: "Rating deleted successfully" });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

module.exports = {
    addRating,
    getRatings,
    getRatingById,
    editRating,
    deleteRating
};