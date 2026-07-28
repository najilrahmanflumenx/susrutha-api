import { Router } from 'express';
import { BranchController } from '../controllers/branch.controller';

const router = Router();

router.get('/', BranchController.getAllBranches);
router.get('/:id', BranchController.getBranchById);
router.post('/', BranchController.createBranch);
router.put('/:id', BranchController.updateBranch);
router.delete('/:id', BranchController.deleteBranch);

export default router;
