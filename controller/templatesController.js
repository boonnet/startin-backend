const Templates = require("../model/templates");
const Enrollment = require("../model/enrollment");
const archiver = require('archiver');
const path = require("path");
const fs = require("fs");

// Create a new template
const createTemplate = async (req, res) => {
  try {
    // Validate request
    if (!req.body.templateName || !req.files || !req.files.file0) {
      return res.status(400).json({ 
        message: "Missing required fields. Template name and at least one file are required." 
      });
    }

    // Process cover image
    const coverImagePath = req.files.file0 ? req.files.file0[0].path : null;
    
    // Process template files
    const templateFiles = [];
    
    // Start from index 1 for template files (file0 is cover image)
    Object.keys(req.files).forEach(key => {
      if (key !== 'file0') { // Skip the cover image
        const file = req.files[key][0];
        templateFiles.push({
          name: file.originalname,
          path: file.path,
          type: file.mimetype
        });
      }
    });

    // Create template record
    const template = await Templates.create({
      template_name: req.body.templateName,
      description: req.body.templateDescription,
      cover_image: coverImagePath,
      price: parseFloat(req.body.templatePrice) || 0,
      files: templateFiles
    });

    res.status(201).json({ 
      message: "Template created successfully", 
      template 
    });
  } catch (error) {
    console.error("Error creating template:", error);
    res.status(500).json({ 
      message: "Error creating template", 
      error: error.message 
    });
  }
};

// Get all templates
const getAllTemplates = async (req, res) => {
  try {
    const templates = await Templates.findAll();
    res.status(200).json({ templates });
  } catch (error) {
    console.error("Error fetching templates:", error);
    res.status(500).json({ 
      message: "Error fetching templates", 
      error: error.message 
    });
  }
};

// Get template by ID
const getTemplateById = async (req, res) => {
  try {
    const template = await Templates.findByPk(req.params.id);
    
    if (!template) {
      return res.status(404).json({ message: "Template not found" });
    }
    
    res.status(200).json({ template });
  } catch (error) {
    console.error("Error fetching template:", error);
    res.status(500).json({ 
      message: "Error fetching template", 
      error: error.message 
    });
  }
};

// Update template
const updateTemplate = async (req, res) => {
  try {
    const template = await Templates.findByPk(req.params.id);
    
    if (!template) {
      return res.status(404).json({ message: "Template not found" });
    }
    
    // Update basic info
    if (req.body.templateName) template.template_name = req.body.templateName;
    if (req.body.templateDescription) template.description = req.body.templateDescription;
    if (req.body.templatePrice) template.price = parseFloat(req.body.templatePrice);
    
    // Update cover image if provided (file0)
    if (req.files && req.files.file0) {
      // Delete old cover image if it exists
      if (template.cover_image && fs.existsSync(template.cover_image)) {
        fs.unlinkSync(template.cover_image);
      }
      
      template.cover_image = req.files.file0[0].path;
    }
    
    // Handle template files
    const fileCount = parseInt(req.body.fileCount || 0);
    let existingFiles = [];
    
    // Parse existing files if they exist
    try {
      existingFiles = template.files ? 
        (typeof template.files === 'string' ? JSON.parse(template.files) : template.files) : 
        [];
    } catch (error) {
      console.error('Error parsing existing files:', error);
      existingFiles = [];
    }
    
    // Process new and existing files
    const newFiles = [];
    let filesChanged = false;
    
    // First, handle existing files from form data
    for (let i = 0; i < fileCount; i++) {
      const existingFileKey = `existingFile${i + 1}`;
      
      if (req.body[existingFileKey]) {
        try {
          const existingFile = JSON.parse(req.body[existingFileKey]);
          newFiles.push(existingFile);
        } catch (error) {
          console.error(`Error parsing existing file data for ${existingFileKey}:`, error);
        }
      }
    }
    
    // Now, handle any new file uploads (file1, file2, etc.)
    for (const key in req.files) {
      // Skip the cover image (file0)
      if (key !== 'file0') {
        filesChanged = true;
        const file = req.files[key][0];
        newFiles.push({
          name: file.originalname,
          path: file.path,
          type: file.mimetype
        });
      }
    }
    
    // Only update files if there's a change
    if (filesChanged || newFiles.length !== existingFiles.length) {
      // If files are being replaced and we have new files, delete old ones
      if (filesChanged && existingFiles.length > 0) {
        for (const fileObj of existingFiles) {
          if (fileObj.path && fs.existsSync(fileObj.path)) {
            fs.unlinkSync(fileObj.path);
          }
        }
      }
      
      template.files = newFiles;
    }
    
    await template.save();
    
    res.status(200).json({ 
      message: "Template updated successfully", 
      template 
    });
  } catch (error) {
    console.error("Error updating template:", error);
    res.status(500).json({ 
      message: "Error updating template", 
      error: error.message 
    });
  }
};

// Delete template
const deleteTemplate = async (req, res) => {
  try {
    const template = await Templates.findByPk(req.params.id);
    
    if (!template) {
      return res.status(404).json({ message: "Template not found" });
    }
    
    // Delete cover image
    if (template.cover_image && fs.existsSync(template.cover_image)) {
      fs.unlinkSync(template.cover_image);
    }
    
    // Delete template files
    for (const fileObj of template.files || []) {
      if (fs.existsSync(fileObj.path)) {
        fs.unlinkSync(fileObj.path);
      }
    }
    
    await template.destroy();
    
    res.status(200).json({ message: "Template deleted successfully" });
  } catch (error) {
    console.error("Error deleting template:", error);
    res.status(500).json({ 
      message: "Error deleting template", 
      error: error.message 
    });
  }
};

const downloadAllFiles = async (req, res) => {
  try {
    const templateId = req.params.id;
    const userId = req.query.user_id;
    
    if (!userId) {
      return res.status(400).json({
        status: 'error',
        message: 'User ID is required'
      });
    }
    
    // Find the template
    const template = await Templates.findByPk(templateId);
    
    if (!template) {
      return res.status(404).json({
        status: 'error',
        message: 'Template not found'
      });
    }

    // Check if user is enrolled in this template
    const enrollment = await Enrollment.findOne({
      where: {
        user_id: userId,
        template_id: templateId, // Use templateId from params
        status: 'active'
      }
    });

    if (!enrollment) {
      return res.status(403).json({
        status: 'error',
        message: 'You are not enrolled in this template'
      });
    }

    // Parse the files array
    let files = [];
    try {
      files = JSON.parse(template.files || '[]');
    } catch (e) {
      console.error('Error parsing template files:', e);
      return res.status(500).json({
        status: 'error',
        message: 'Could not parse template files'
      });
    }
    
    if (files.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'No files found for this template'
      });
    }

    // Set up the response
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', `attachment; filename="${template.template_name || 'template'}-files.zip"`);

    // Create a zip file
    const archive = archiver('zip', {
      zlib: { level: 9 } // Best compression
    });
    
    // Handle archive errors
    archive.on('error', (err) => {
      console.error('Archive error:', err);
      res.status(500).json({
        status: 'error',
        message: 'Failed to create zip archive'
      });
    });
    
    // Pipe the archive to the response
    archive.pipe(res);

    // Add files to the archive
    for (const file of files) {
      const filePath = file.path;
      if (fs.existsSync(filePath)) {
        const fileName = file.originalname || path.basename(filePath);
        archive.file(filePath, { name: fileName });
      } else {
        console.warn(`File not found: ${filePath}`);
      }
    }

    // Finalize the archive and send response
    archive.finalize();
    
  } catch (error) {
    console.error('Error in downloadAllFiles:', error);
    res.status(500).json({
      status: 'error',
      message: error.message || 'An error occurred while downloading files'
    });
  }
};

// Export all controller functions
module.exports = {
  createTemplate,
  getAllTemplates,
  getTemplateById,
  updateTemplate,
  deleteTemplate,
  downloadAllFiles
};