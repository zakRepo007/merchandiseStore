import { Router } from 'express';
import { getMerchandise
   , createMerchandise, updateMerchandise, deleteMerchandise
 } from '../controllers/merchandiseController';

const router = Router();

router.get('/', getMerchandise);
router.post('/', createMerchandise);
 router.put('/:id', updateMerchandise);
 router.delete('/:id', deleteMerchandise);

export default router;
