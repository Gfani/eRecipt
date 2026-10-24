import { Router } from 'express';
import { settingsController } from '../controllers/settingsController.js';

export const settingsRoutes = Router();

settingsRoutes.get('/profile', settingsController.getProfile);
settingsRoutes.patch('/profile', settingsController.updateProfile);

export default settingsRoutes;
