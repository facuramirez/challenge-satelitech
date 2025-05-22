import { Router } from 'express';
import { getAllViajes, createViaje, updateViaje, deleteViaje, getViajeById } from '../controllers/viajeController';
import { auth } from '../middleware/auth';

const router = Router();

router.get('/', auth, getAllViajes);
router.get('/:id', auth, getViajeById);
router.post('/', auth, createViaje);
router.put('/:id', auth, updateViaje);
router.delete('/:id', auth, deleteViaje);

export default router; 