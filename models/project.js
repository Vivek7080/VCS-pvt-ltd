import mongoose from "mongoose";
import User from './user.js';

const projectSchema = new mongoose.Schema({
  ClientID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", 
    required: true,
    
  },
  ProjectName: {
    type: String,
    required: true,
  },
  CompanyName: {
    type: String,
    required: true,
  },
  ProjectCost: {
    type: Number,
    required: true,
  },
  AdvancePayment: {
    type: Number,
    required: true,
  },
  PendingPayment: {
    type: Number,
    required: true,
  },
  ProjectType: {
    type: [String], // Allow an array of strings
    enum: [
      "Web Development",
      "UI/UX Design",
      "Mobile App Development",
      "ERP",
      "Software Development",
      "CRM",
    ],
    required: true,
    validate: {
      validator: (value) => value.length > 0, // Ensure at least one value is selected
      message: "At least one project type is required.",
    },
  },
  
  PlatformPreference: {
    type: String,
    required: true,
  },
  StartDate: {
    type: Date,
    required: true,
  },
  EndDate: {
    type: Date,
    required: true,
  },
  ProjectStatus: {
    type: String,
    required: true,
  },
});

const Project = mongoose.model("Project", projectSchema);

export default Project;

