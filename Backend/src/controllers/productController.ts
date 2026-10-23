import type { Request, Response } from 'express';
import { db } from '../database/db.js';

export class ProductController {
  /**
   * GET /api/products
   */
  public static async list(_req: Request, res: Response): Promise<void> {
    try {
      const products = db.getProducts();
      res.json({ success: true, count: products.length, products });
    } catch (err) {
      console.error('Error fetching products:', err);
      res.status(500).json({ error: 'Internal server error while fetching products.' });
    }
  }

  /**
   * GET /api/products/:code
   */
  public static async getByCode(req: Request, res: Response): Promise<void> {
    try {
      const code = Array.isArray(req.params.code) ? req.params.code[0] : req.params.code;
      const product = db.getProducts().find((p) => p.code.toLowerCase() === (code || '').toLowerCase());

      if (!product) {
        res.status(404).json({ error: `Product with code "${code}" not found.` });
        return;
      }

      res.json({ success: true, product });
    } catch (err) {
      console.error('Error fetching product by code:', err);
      res.status(500).json({ error: 'Internal server error while fetching product.' });
    }
  }
}
