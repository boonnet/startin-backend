const express = require('express');
const router = express.Router();
const { uploadTemplateFiles } = require('../middleware/multer');
const templatesController = require('../controller/templatesController');

// Create template route
router.post('/templates/create', uploadTemplateFiles, templatesController.createTemplate);

// Get all templates
router.get('/templates/all', templatesController.getAllTemplates);

// Get template by ID
router.get('/templates/:id', templatesController.getTemplateById);

// Update template
router.put('/templates/update/:id', uploadTemplateFiles, templatesController.updateTemplate);

// Delete template
router.delete('/templates/delete/:id', templatesController.deleteTemplate);

// Download all template files as a zip
router.get('/templates/:id/download-all', templatesController.downloadAllFiles);

module.exports = router;