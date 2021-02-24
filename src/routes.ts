import { Router } from 'express';

import { SurveysController } from './controllers/SurveysController';
import { UsersController } from './controllers/UsersController';

const surveysController = new SurveysController();
const usersController = new UsersController();
const router = Router();

router.post('/surveys', surveysController.create);
router.post('/users', usersController.create);

export default router;
