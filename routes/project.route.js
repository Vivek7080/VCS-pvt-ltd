import express, { Router } from 'express'
import {ProjectSignupForm,GetAllProject,GetUserProjects} from '../controller/project.controller.js'
import {SecureRoute,restrict} from '../middleware/SecureRoute.js';
const router=express.Router();
router.post('/ProjectSignupForm', SecureRoute, restrict("admin"), ProjectSignupForm);
router.get('/GetAllProject',GetAllProject)
router.get('/GetUserProjects',SecureRoute,GetUserProjects)
export default router
