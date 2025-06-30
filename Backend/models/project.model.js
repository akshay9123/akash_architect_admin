import mongoose from 'mongoose';

const ProjectSchema = new mongoose.Schema(
  {
    types: {
      type: [String],
      enum: ['Architecture', 'Interior'],
      required: true,
    },
    projectStatus : {
      type: String,
      enum: ['Ongoing', 'Completed', 'Upcoming'],
    },
    projectName: {
      type: String,
      required: true,
      trim: true,
    },
    mainImage: {
      type: String,
      required: true,
    },
    allImage: { 
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

const Project = mongoose.model('Project', ProjectSchema);

export default Project;
