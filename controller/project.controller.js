import mongoose from 'mongoose';
import Project from '../models/project.js'
import User from "../models/user.js";
import path from 'path'
import { fileURLToPath } from 'url'

const __filename=fileURLToPath(import.meta.url)
const _dirname=path.dirname(__filename)

export const ProjectSignupForm=async(req , res)=>{
    try
    {
        const {
            ClientID, ProjectName, CompanyName, ProjectCost, AdvancePayment,PendingPayment, ProjectType , PlatformPreference, StartDate,EndDate,ProjectStatus } = req.body;
            console.log(req.body);
            if (
                !ClientID ||
                !ProjectName ||
                !CompanyName ||
                !ProjectCost ||
                !AdvancePayment ||
                !PendingPayment||
                !ProjectType ||
                !PlatformPreference ||
                !StartDate ||
                !EndDate ||
                !ProjectStatus
              ) {
                return res.status(400).json({ message: "All fields are required" });
              }


              if (!mongoose.Types.ObjectId.isValid(ClientID)) {
                return res.status(400).json({ message: "Invalid ClientID format" });
              }
              const user = await User.findOne({ _id: ClientID });
              if (!user) {
                return res.status(404).json({ message: "Client with this email does not exist" });
              }


              const newProject = new Project({
                ClientID,
                ProjectName,
                CompanyName,
                ProjectCost,
                AdvancePayment,
                PendingPayment,
                ProjectType,
                PlatformPreference,
                StartDate,
                EndDate,
                ProjectStatus,
              });
          
              await newProject.save();
          
              res.status(201).json({ message: "Project created successfully", project: newProject });
        }

    catch(error)
    {
        console.log('error in signup_project',error.message);
        res.status(500).json({message:"Internal server error in signup_project"})
    }
}


export const GetAllProject = async (req, res) => {
  try {
    const projects=await Project.find({})
    res.status(200).json({ projects });
  } catch (error) {
    console.error("Error in Get_All_project:", error.message);
    res.status(500).json({ message: "Internal server error to get all project details" });
  }
};




export const GetUserProjects = async (req, res) => {
  try {
      console.log("Logged-in user email:", req.user.email);
      console.log("Logged-in user ID:", req.user._id);

      const projects = await Project.find({ ClientID: req.user._id });

      console.log("Projects found:", projects);

      res.status(200).json({ projects });
  } catch (error) {
      console.error("Error in GetUserProjects:", error.message);
      res.status(500).json({ message: "Internal server error while fetching user projects" });
  }
};
