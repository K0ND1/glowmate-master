import { Router } from 'express';
import { getProducts, createProduct, getRecommendations, getProductByBarcode } from '../controllers/product.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

router.get('/', getProducts);
router.post('/', authenticateToken, createProduct);
router.get('/for-me', authenticateToken, getRecommendations);
router.get('/:barcode', getProductByBarcode);

export default router;
