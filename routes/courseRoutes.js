const express = require("express");
const router = express.Router();
const { addCourse, getAllCourses, getCourseById, updateCourse, deleteCourse } = require("../controller/courseController");
const {uploadFiles} = require("../middleware/multer");
const {courseValidator, updateCourseValidator} = require("../validator/courseValidator");

router.post("/course", courseValidator, uploadFiles, addCourse);

router.get("/course/all", getAllCourses);

router.get("/course/:id", getCourseById);

router.put('/course/:id', updateCourseValidator, uploadFiles, updateCourse);

router.delete('/course/:id', deleteCourse);

module.exports = router;
