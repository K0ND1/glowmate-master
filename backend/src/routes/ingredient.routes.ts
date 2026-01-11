import { Router } from 'express';
import { suggestIngredients } from '../controllers/ingredient.controller';

const router = Router();

router.get('/suggest', suggestIngredients);

export default router;
