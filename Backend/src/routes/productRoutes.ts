import { Router } from 'express';
import { ProductController } from '../controllers/productController.js';

export const productRoutes = Router();

productRoutes.get('/', ProductController.list);
productRoutes.get('/:code', ProductController.getByCode);
