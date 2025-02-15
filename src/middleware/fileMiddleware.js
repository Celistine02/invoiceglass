const LearningResource = require('../models/learningResources/LearningResource');
const fs = require('fs').promises;
const path = require('path');

const ensureUploadsDirectoryExists = async () => {
  const uploadsPath = path.join(__dirname, '..', 'uploads');
  try {
    await fs.access(uploadsPath);
  } catch {
    await fs.mkdir(uploadsPath, { recursive: true });
  }
};

const uploadPDF = async (req, res) => {
  try {
    await ensureUploadsDirectoryExists();

    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { title, description, uploadedBy } = req.body;
    const fileBuffer = req.file.buffer;
    const fileName = Date.now() + '-' + req.file.originalname;
    const filePath = path.join(__dirname, '..', 'uploads', fileName); // Ensure absolute path
    const fileSize = req.file.size;

    // Write the file to the uploads directory
    await fs.writeFile(filePath, fileBuffer);

    // Create a new learning resource document
    const resource = new LearningResource({
      title,
      description,
      filePath,
      uploadedBy,
      fileSize,
    });

    // Save it to the database
    await resource.save();

    res.status(200).json({ message: 'PDF uploaded successfully', resource });
  } catch (err) {
    res.status(500).json({ error: 'Error uploading PDF', details: err.message });
  }
};

const getPDFs = async (req, res) => {
  try {
    const resources = await LearningResource.find();
    res.status(200).json({ resources });
  } catch (err) {
    res.status(500).json({ error: 'Error retrieving PDFs', details: err.message });
  }
};

module.exports = { uploadPDF, getPDFs };
