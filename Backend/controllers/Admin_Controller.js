import Project from "../models/project.model.js";

// CREATING A NEW PROJECT
export const createProject = async (req, res) => {
  try {
    const { types, projectName, projectStatus } = req.body;
    const mainImage = req.file?.filename || null;

    if (!types || !projectName || !mainImage) {
      return res.status(400).json({ message: 'All required fields must be provided' });
    }

    const newProject = new Project({
      types,
      projectName,
      projectStatus,
      mainImage: `/uploads/${mainImage}`,
    });

    await newProject.save();
    res.status(201).json({ message: 'Project created successfully', project: newProject });
  } catch (error) {
    console.error('Create Project Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


// UPDATE THE MAIN PAGE AND ALL IMAGE AND STATUS ALSO 
export const updateProjectImages = async (req, res) => {
  try {
    const { id } = req.params;
    const { projectStatus } = req.body;

    const mainImageFile = req.files?.mainImage?.[0] || null;
    const galleryImageFiles = req.files?.galleryImages || [];

    if (!id) {
      return res.status(400).json({ message: 'Project ID is required.' });
    }

    const updateData = {};

    if (mainImageFile) {
      updateData.mainImage = `/uploads/${mainImageFile.filename}`;
    }

    if (galleryImageFiles.length > 0) {
      updateData.allImage = galleryImageFiles.map(file => `/uploads/${file.filename}`);
    }

    if (projectStatus) {
      updateData.projectStatus = projectStatus;
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: 'No update data provided (images or status).' });
    }

    const updatedProject = await Project.findByIdAndUpdate(id, updateData, { new: true });

    if (!updatedProject) {
      return res.status(404).json({ message: 'Project not found.' });
    }

    res.status(200).json({ message: 'Project updated successfully.', project: updatedProject });
  } catch (error) {
    console.error('Update Project Images Error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};




// GETTING ALL PROJECT NAMES
export const getAllProjectNames = async (req, res) => {
  try {
    const projects = await Project.find().select('projectName');
    res.status(200).json(projects);
  } catch (error) {
    console.error('Get Projects Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};



// GET ALL PROJECT NAME AND IMAGE FOR THE FRONTEND FOR THE ARCHITECTURE
export const getAllProjectNamesAndImagesArchitecture = async (req, res) => {
  try {
    const baseUrl = `${req.protocol}://${req.get('host')}`;

    // Filter projects where types === 'Architecture'
    const projects = await Project.find({ types: 'Architecture' }).select('projectName mainImage allImage types');

    const updatedProjects = projects.map((project) => ({
      ...project._doc,
      mainImage: `${baseUrl}${project.mainImage}`,
      allImage: project.allImage.map((img) => `${baseUrl}${img}`),
    }));

    res.status(200).json(updatedProjects);
  } catch (error) {
    console.error('Get Projects Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// GET ALL PROJECT NAME AND IMAGE FOR THE FRONTEND FOR THE INTERIOR SECTION
export const getAllProjectNamesAndImagesInterior = async (req, res) => {
  try {
    const baseUrl = `${req.protocol}://${req.get('host')}`;

    // Filter projects where types === 'Architecture'
    const projects = await Project.find({ types: 'Interior' }).select('projectName mainImage allImage types');

    const updatedProjects = projects.map((project) => ({
      ...project._doc,
      mainImage: `${baseUrl}${project.mainImage}`,
      allImage: project.allImage.map((img) => `${baseUrl}${img}`),
    }));

    res.status(200).json(updatedProjects);
  } catch (error) {
    console.error('Get Projects Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// GET ALL ARCHITECTURE NAME TO LIST THE ARCHITECURE NAME ON THE DASHBOARD OF THE FRONTEND
export const architecure = async(req, res) =>{
  try {
    const projects = await Project.find({types: 'Architecture' }).select('projectName')

    res.status(200).json(projects)
  } catch (error) {
    
  }
}

// Update a project by ID
export const updateProject = async (req, res) => {
  try {
    const { iprojectNamed } = req.params;
    const { types, projectName } = req.body;
    const updateData = {};

    if (types) updateData.types = types;
    if (projectName) updateData.projectName = projectName;
    if (req.files?.mainImage?.[0]) {
      updateData.mainImage = `/uploads/${req.files.mainImage[0].filename}`;
    }
    if (req.files?.allImage) {
      updateData.allImage = req.files.allImage.map(file => `/uploads/${file.filename}`);
    }

    const updated = await Project.findByIdAndUpdate(id, updateData, { new: true });

    if (!updated) return res.status(404).json({ message: 'Project not found' });

    res.status(200).json({ message: 'Project updated successfully', project: updated });
  } catch (error) {
    console.error('Update Project Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


// Get all project details
export const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find();
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const projectdetails = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).select('allImage');
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.status(200).json(project);
  } catch (error) {
    console.error('Error fetching project images:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


// Delete a project
export const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Project.findByIdAndDelete(id);

    if (!deleted) return res.status(404).json({ message: 'Project not found' });

    res.status(200).json({ message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};


