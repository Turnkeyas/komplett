import { Router } from 'express';
import { reportComponent } from '..';
const router: Router = Router();

router.get('/', reportComponent.fetchReportData);

export default router;