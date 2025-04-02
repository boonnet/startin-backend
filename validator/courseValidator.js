const { body } = require("express-validator");

const courseValidator = [
  body("course_title")
    .trim()
    .notEmpty()
    .withMessage("Course title is required")
    .isLength({ min: 3 })
    .withMessage("Course title must be at least 3 characters long"),

  body("parent_category")
    .trim()
    .notEmpty()
    .withMessage("Parent category is required"),

  body("sub_category")
    .trim()
    .notEmpty()
    .withMessage("Sub-category is required"),

  body("course_description")
    .trim()
    .notEmpty()
    .withMessage("Course description is required"),

  body("time_spend")
    .trim()
    .notEmpty()
    .withMessage("Time spend is required"),

  body("course_requirements")
    .trim()
    .notEmpty()
    .withMessage("Course requirements are required"),

  body("course_level")
    .trim()
    .notEmpty()
    .withMessage("Course level is required")
    .isIn(["Beginner", "Intermediate", "Advanced"])
    .withMessage("Course level must be Beginner, Intermediate, or Advanced"),

  // Validate lessons array
  body("lessons").isArray().withMessage("Lessons must be an array"),

  // Validate each lesson inside the lessons array
  body("lessons.*.lession_title")
    .trim()
    .notEmpty()
    .withMessage("Lesson title is required"),

  body("lessons.*.content_type")
    .trim()
    .notEmpty()
    .withMessage("Content type is required")
    .isIn(["Video", "Quiz"])
    .withMessage("Content type must be Video or Quiz"),

  body("lessons.*.lession_order")
    .isInt({ min: 1 })
    .withMessage("Lesson order must be a positive integer"),

  // If content_type is Video, duration must be provided
  body("lessons.*.duration")
    .if((value, { req }) =>
      req.body.lessons?.some((lesson) => lesson.content_type === "Video")
    )
    .isInt({ min: 1 })
    .withMessage("Duration is required for video lessons"),

  // Validate Quiz fields if content_type is Quiz
  body("lessons.*.quiz.quiz_title")
    .if((value, { req }) =>
      req.body.lessons?.some((lesson) => lesson.content_type === "Quiz")
    )
    .notEmpty()
    .withMessage("Quiz title is required"),

  body("lessons.*.quiz.questions")
    .if((value, { req }) =>
      req.body.lessons?.some((lesson) => lesson.content_type === "Quiz")
    )
    .isArray()
    .withMessage("Questions must be an array"),

  body("lessons.*.quiz.questions.*.question")
    .notEmpty()
    .withMessage("Question text is required"),

  body("lessons.*.quiz.questions.*.correct_answer")
    .notEmpty()
    .withMessage("Correct answer is required"),
];

const updateCourseValidator = [
  body("course_title")
    .optional()
    .trim()
    .isLength({ min: 3 })
    .withMessage("Course title must be at least 3 characters long"),

  body("parent_category").optional().trim(),

  body("sub_category").optional().trim(),

  body("course_description").optional().trim(),

  body("time_spend").optional().trim(),

  body("course_requirements").optional().trim(),

  body("course_level")
    .optional()
    .trim()
    .isIn(["Beginner", "Intermediate", "Advanced"])
    .withMessage("Course level must be Beginner, Intermediate, or Advanced"),

  // Validate lessons array (optional)
  body("lessons").optional().isArray().withMessage("Lessons must be an array"),

  // Validate each lesson inside the lessons array
  body("lessons.*.lession_title").optional().trim(),

  body("lessons.*.content_type")
    .optional()
    .trim()
    .isIn(["Video", "Quiz"])
    .withMessage("Content type must be Video or Quiz"),

  body("lessons.*.lession_order")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Lesson order must be a positive integer"),

  // If content_type is Video, duration must be provided
  body("lessons.*.duration")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Duration must be a positive integer"),

  // Validate Quiz fields if content_type is Quiz
  body("lessons.*.quiz.quiz_title").optional().trim(),

  body("lessons.*.quiz.questions").optional().isArray(),

  body("lessons.*.quiz.questions.*.question").optional().trim(),

  body("lessons.*.quiz.questions.*.correct_answer").optional().trim(),
];


module.exports = { courseValidator, updateCourseValidator };
