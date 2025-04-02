const Course = require("../model/course");
const Lession = require("../model/lessions");
const Quiz = require("../model/quiz");
const Questions = require("../model/questions");
const db = require("../config/db");
const path = require("path");
const fs = require("fs");
const Certifications = require("../model/certifications");
const Rating = require('../model/ratings');

const addCourse = async (req, res) => {
    try {
      const courseData = JSON.parse(req.body.data || "{}");
  
      if (
        !courseData.course_title ||
        !courseData.parent_category ||
        !courseData.sub_category ||
        !courseData.course_description ||
        !courseData.time_spend ||
        !courseData.course_requirements ||
        !courseData.course_level ||
        courseData.course_price === undefined // Add this check
      ) {
        return res.status(400).json({ message: "Missing required fields" });
      }
  
      courseData.course_image = req.files.course_image ? req.files.course_image[0].path : null;
      courseData.preview_video = req.files.preview_video ? req.files.preview_video[0].path : null;
      
      // Handle certificate template
      if (req.files.certificate_template) {
        courseData.certificate_template = req.files.certificate_template[0].path;
      }
      
      // Ensure price is a valid number
      courseData.course_price = parseFloat(courseData.course_price) || 0;
      
      const newCourse = await Course.create(courseData);
      
      // If there's a certificate template, also create a certification record
      if (courseData.certificate_template) {
        await Certifications.create({
          course_id: newCourse.id,
          template: courseData.certificate_template
        });
      }
  
      // Track indices for each file type
      let videoIndex = 0;
      let imageIndex = 0;
      let documentIndex = 0;
  
      if (courseData.lessons && courseData.lessons.length > 0) {
        for (const lesson of courseData.lessons) {
          // Prepare lesson data with correct file paths
          const lessonData = {
            ...lesson,
            course_id: newCourse.id,
          };
  
          // Add video file path if available
          if (lesson.content_type === 'Video') {
            if (req.files.lesson_videos && req.files.lesson_videos[videoIndex]) {
              lessonData.lession_video = req.files.lesson_videos[videoIndex].path;
              videoIndex++;
            }
            
            // Add image file path if available
            if (req.files.lesson_images && req.files.lesson_images[imageIndex]) {
              lessonData.lession_image = req.files.lesson_images[imageIndex].path;
              imageIndex++;
            }
            
            // Add document file path if available
            if (req.files.lesson_documents && req.files.lesson_documents[documentIndex]) {
              lessonData.document_url = req.files.lesson_documents[documentIndex].path;
              documentIndex++;
            }
          }
  
          const newLesson = await Lession.create(lessonData);
  
          if (lesson.content_type === "Quiz" && lesson.quiz) {
            const newQuiz = await Quiz.create({
              lession_id: newLesson.id,
              quiz_title: lesson.quiz.quiz_title,
            });
  
            await newLesson.update({
              quiz_id: newQuiz.id
            });
  
            for (const question of lesson.quiz.questions) {
              await Questions.create({
                quiz_id: newQuiz.id,
                ...question,
              });
            }
          }
        }
      }
  
      res.status(201).json({ message: "Course added successfully", course: newCourse });
    } catch (error) {
      console.error("Error adding course:", error);
      res.status(500).json({ message: "Error adding course", error: error.message });
    }
};

const getAllCourses = async (req, res) => {
    try {
        const courses = await Course.findAll(
            {
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
        }
    );
        res.status(200).json({ courses });
    } catch (error) {
        console.error("Error fetching courses:", error);
        res.status(500).json({ message: "Error fetching courses", error: error.message });
    }
};


const getCourseById = async (req, res) => {
    try {
        const course = await Course.findByPk(req.params.id, {
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
        });

        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }

        res.status(200).json({ course });
    } catch (error) {
        console.error("Error fetching course:", error);
        res.status(500).json({ message: "Error fetching course", error: error.message });
    }
};

const updateCourse = async (req, res) => {
    try {
        const course = await Course.findByPk(req.params.id, {
            include: [
                {
                    model: Lession,
                    include: [
                        {
                            model: Quiz,
                            include: [{ model: Questions }]
                        }
                    ]
                }
            ]
        });

        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }

        const courseData = JSON.parse(req.body.data || "{}");

        // Update course details
        course.course_title = courseData.course_title || course.course_title;
        course.parent_category = courseData.parent_category || course.parent_category;
        course.sub_category = courseData.sub_category || course.sub_category;
        course.course_description = courseData.course_description || course.course_description;
        course.time_spend = courseData.time_spend || course.time_spend;
        course.course_requirements = courseData.course_requirements || course.course_requirements;
        course.course_level = courseData.course_level || course.course_level;
        course.validity_days = courseData.validity_days || course.validity_days;
        course.course_price = courseData.course_price !== undefined ? courseData.course_price : course.course_price;

        // Update course files if provided
        if (req.files) {
            if (req.files.course_image && req.files.course_image[0]) {
                course.course_image = req.files.course_image[0].path;
            }
            
            if (req.files.preview_video && req.files.preview_video[0]) {
                course.preview_video = req.files.preview_video[0].path;
            }
            
            if (req.files.certificate_template && req.files.certificate_template[0]) {
                course.certificate_template = req.files.certificate_template[0].path;
            }
        }

        await course.save();

        // Get lesson image and video indices
        const lessonImageIndices = req.body.lesson_image_index ? 
            Array.isArray(req.body.lesson_image_index) ? 
                req.body.lesson_image_index : [req.body.lesson_image_index] : [];
                
        const lessonVideoIndices = req.body.lesson_video_index ? 
            Array.isArray(req.body.lesson_video_index) ? 
                req.body.lesson_video_index : [req.body.lesson_video_index] : [];

        // Update or Add Lessons
        if (courseData.lessons) {
            for (const [index, lessonData] of courseData.lessons.entries()) {
                let lesson;
                
                // Find or create the lesson
                if (lessonData.id) {
                    lesson = await Lession.findByPk(lessonData.id);
                    if (lesson) {
                        // Update lesson basic info
                        await lesson.update({
                            lession_title: lessonData.lession_title,
                            content_type: lessonData.content_type,
                            lession_order: lessonData.lession_order,
                            description: lessonData.description,
                            duration: lessonData.duration,
                            document_url: lessonData.document_url
                        });
                    } else {
                        // If ID provided but not found, create new
                        lesson = await Lession.create({
                            ...lessonData,
                            course_id: course.id
                        });
                    }
                } else {
                    // Create new lesson
                    lesson = await Lession.create({
                        lession_title: lessonData.lession_title,
                        content_type: lessonData.content_type,
                        lession_order: lessonData.lession_order,
                        description: lessonData.description,
                        duration: lessonData.duration,
                        document_url: lessonData.document_url,
                        course_id: course.id
                    });
                }

                // Update lesson files if available
                if (req.files) {
                    // Handle lesson images
                    if (req.files.lesson_images) {
                        const imageIndex = lessonImageIndices.findIndex(idx => parseInt(idx) === index);
                        if (imageIndex !== -1 && req.files.lesson_images[imageIndex]) {
                            lesson.lession_image = req.files.lesson_images[imageIndex].path;
                            await lesson.save();
                        }
                    }

                    // Handle lesson videos
                    if (req.files.lesson_videos) {
                        const videoIndex = lessonVideoIndices.findIndex(idx => parseInt(idx) === index);
                        if (videoIndex !== -1 && req.files.lesson_videos[videoIndex]) {
                            lesson.lession_video = req.files.lesson_videos[videoIndex].path;
                            await lesson.save();
                        }
                    }
                }

                // Update or Add Quizzes
                if (lessonData.content_type === "Quiz" && lessonData.quiz) {
                    let quiz;
                    if (lessonData.quiz.id) {
                        quiz = await Quiz.findByPk(lessonData.quiz.id);
                        if (quiz) {
                            await quiz.update({
                                quiz_title: lessonData.quiz.quiz_title
                            });
                        } else {
                            quiz = await Quiz.create({
                                lession_id: lesson.id,
                                quiz_title: lessonData.quiz.quiz_title
                            });
                        }
                    } else {
                        quiz = await Quiz.create({
                            lession_id: lesson.id,
                            quiz_title: lessonData.quiz.quiz_title
                        });
                    }

                    // Update or Add Questions
                    if (lessonData.quiz.questions) {
                        // Get existing questions to detect questions to remove
                        const existingQuestions = quiz.id ? 
                            await Questions.findAll({ where: { quiz_id: quiz.id } }) : [];
                        const existingQuestionIds = existingQuestions.map(q => q.id);
                        const updatedQuestionIds = [];

                        for (const questionData of lessonData.quiz.questions) {
                            let question;
                            if (questionData.id) {
                                question = await Questions.findByPk(questionData.id);
                                if (question) {
                                    await question.update({
                                        question: questionData.question,
                                        option_1: questionData.option_1,
                                        option_2: questionData.option_2,
                                        option_3: questionData.option_3,
                                        option_4: questionData.option_4,
                                        correct_answer: questionData.correct_answer
                                    });
                                    updatedQuestionIds.push(question.id);
                                } else {
                                    question = await Questions.create({
                                        quiz_id: quiz.id,
                                        question: questionData.question,
                                        option_1: questionData.option_1,
                                        option_2: questionData.option_2,
                                        option_3: questionData.option_3,
                                        option_4: questionData.option_4,
                                        correct_answer: questionData.correct_answer
                                    });
                                    updatedQuestionIds.push(question.id);
                                }
                            } else {
                                question = await Questions.create({
                                    quiz_id: quiz.id,
                                    question: questionData.question,
                                    option_1: questionData.option_1,
                                    option_2: questionData.option_2,
                                    option_3: questionData.option_3,
                                    option_4: questionData.option_4,
                                    correct_answer: questionData.correct_answer
                                });
                                updatedQuestionIds.push(question.id);
                            }
                        }

                        // Remove questions that were not updated
                        const questionsToRemove = existingQuestionIds.filter(
                            id => !updatedQuestionIds.includes(id)
                        );
                        
                        if (questionsToRemove.length > 0) {
                            await Questions.destroy({
                                where: { id: questionsToRemove }
                            });
                        }
                    }
                }
            }

            // Handle lesson removal - get existing lesson IDs to detect which to remove
            const existingLessons = await Lession.findAll({ 
                where: { course_id: course.id } 
            });
            const existingLessonIds = existingLessons.map(l => l.id);
            const updatedLessonIds = courseData.lessons
                .filter(l => l.id)
                .map(l => parseInt(l.id));

            // Find lessons to delete (existing but not in updated list)
            const lessonsToRemove = existingLessonIds.filter(
                id => !updatedLessonIds.includes(id)
            );
            
            if (lessonsToRemove.length > 0) {
                // Delete associated quizzes and questions
                const lessonsToDelete = await Lession.findAll({
                    where: { id: lessonsToRemove },
                    include: [{ model: Quiz, include: [{ model: Questions }] }]
                });

                for (const lesson of lessonsToDelete) {
                    if (lesson.Quiz) {
                        if (lesson.Quiz.Questions && lesson.Quiz.Questions.length > 0) {
                            await Questions.destroy({
                                where: { quiz_id: lesson.Quiz.id }
                            });
                        }
                        await Quiz.destroy({
                            where: { id: lesson.Quiz.id }
                        });
                    }
                }

                // Now delete the lessons
                await Lession.destroy({
                    where: { id: lessonsToRemove }
                });
            }
        }

        res.status(200).json({ 
            message: "Course updated successfully", 
            course: await course.reload({ 
                include: [
                    {
                        model: Lession,
                        include: [
                            {
                                model: Quiz,
                                include: [{ model: Questions }]
                            }
                        ]
                    }
                ]
            }) 
        });
    } catch (error) {
        console.error("Error updating course:", error);
        res.status(500).json({ message: "Error updating course", error: error.message });
    }
};



const deleteCourse = async (req, res) => {
    try {
        const course = await Course.findByPk(req.params.id, {
            include: [
                {
                    model: Lession,
                    include: [
                        {
                            model: Quiz,
                            include: [{ model: Questions }]
                        }
                    ]
                }
            ]
        });

        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }

        for (const lesson of course.Lessions) {
            // If lesson type is 'Quiz', delete related quiz questions
            if (lesson.content_type === "Quiz") {
                await Questions.destroy({ where: { quiz_id: lesson.Quiz.id } });
                await Quiz.destroy({ where: { lession_id: lesson.id } });
            }
            // If lesson type is 'Video', delete stored files
            else if (lesson.content_type === "Video") {
                if (lesson.lession_video) {
                    await deleteFile(lesson.lession_video);
                }
                if (lesson.lession_image) {
                    await deleteFile(lesson.lession_image); 
                }
                if(lesson.document_url){
                    await deleteFile(lesson.document_url); 
                }
            }
        }

        // Delete related lessons
        await Lession.destroy({ where: { course_id: course.id } });

        await deleteFile(course.course_image);
        
        await deleteFile(course.preview_video);

        // Delete the course
        await course.destroy();

        res.status(200).json({ message: "Course and all related data deleted successfully" });
    } catch (error) {
        console.error("Error deleting course:", error);
        res.status(500).json({ message: "Error deleting course", error: error.message });
    }
};

// Helper function to delete files (Local + S3)
const deleteFile = async (filePath) => {
    console.log(filePath)
    try {
        if (filePath.startsWith("https://your-s3-bucket-name.s3.amazonaws.com/")) {
            // Delete from S3
            const fileKey = filePath.split(".com/")[1]; 
            await s3.deleteObject({ Bucket: "your-s3-bucket-name", Key: fileKey }).promise();
            console.log(`Deleted from S3: ${fileKey}`);
        } else {
            // Delete from Local Server
            const localPath = path.join(__dirname, "../", filePath); 
            console.log(localPath);
            if (fs.existsSync(localPath)) {
                fs.unlinkSync(localPath);
                console.log(`Deleted from Local: ${localPath}`);
            }
        }
    } catch (err) {
        console.error("Error deleting file:", err);
    }
};

  
  module.exports = {addCourse, getAllCourses, getCourseById, updateCourse, deleteCourse};
