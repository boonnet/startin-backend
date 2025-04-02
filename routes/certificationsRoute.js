const express = require('express');
const router = express.Router();

const {uploadCertificateTemplate} = require('../middleware/multer');
const certificationController = require('../controller/certificationsController');

router.post('/course/certificate', uploadCertificateTemplate, certificationController.createCertification);

router.get('/course/allcertificate', certificationController.getAllCertifications);

router.get('/course/certificate/:id', certificationController.getCertificationById);

router.put('/course/certificate/:id', uploadCertificateTemplate, certificationController.updateCertification);

router.delete('/course/certificate/:id', certificationController.deleteCertification);

module.exports = router;
