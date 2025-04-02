const Certifications = require('../model/certifications.js');
const Course = require('../model/course.js');

// Create a Certification
const createCertification = async (req, res) => {
    try {
      const { course_id } = req.body;
      
      if (!req.file) {
        return res.status(400).json({ message: 'Template image is required' });
      }
  
      const templatePath = req.file.location || req.file.path;
  
      const certification = await Certifications.create({ course_id, template: templatePath });
  
      res.status(201).json({ message: 'Certification created successfully', certification });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  };

// Get All Certifications
const getAllCertifications = async (req, res) => {
    try {
        const certifications = await Certifications.findAll({
            include: { model: Course, as: 'course' },
        });
        res.status(200).json(certifications);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get a Single Certification by ID
const getCertificationById = async (req, res) => {
    try {
        const { id } = req.params;
        const certification = await Certifications.findByPk(id, {
            include: { model: Course, as: 'course' },
        });
        if (!certification) {
            return res.status(404).json({ message: 'Certification not found' });
        }
        res.status(200).json(certification);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Update a Certification
const updateCertification = async (req, res) => {
    try {
        const { id } = req.params;
        const { template } = req.body;
        
        const certification = await Certifications.findByPk(id);
        if (!certification) {
            return res.status(404).json({ message: 'Certification not found' });
        }
        
        certification.template = template;
        await certification.save();
        res.status(200).json({ message: 'Certification updated successfully', certification });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Delete a Certification
const deleteCertification = async (req, res) => {
    try {
        const { id } = req.params;
        const certification = await Certifications.findByPk(id);
        if (!certification) {
            return res.status(404).json({ message: 'Certification not found' });
        }
        
        await certification.destroy();
        res.status(200).json({ message: 'Certification deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = {createCertification, getAllCertifications, getCertificationById, updateCertification, deleteCertification};