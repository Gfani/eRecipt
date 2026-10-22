import { Router } from 'express';
import { TinController } from '../controllers/tinController.js';

export const tinRoutes = Router();

tinRoutes.post('/verify', TinController.verify);
tinRoutes.get('/verify', TinController.verify);
tinRoutes.get('/:tin', TinController.getByTin);
