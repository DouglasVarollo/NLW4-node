import { Router } from 'express';

import { SendMailController } from './controllers/SendMailController';
import { SurveysController } from './controllers/SurveysController';
import { UsersController } from './controllers/UsersController';

const sendMailController = new SendMailController();
const surveysController = new SurveysController();
const usersController = new UsersController();
const router = Router();

router.post('/sendMail', sendMailController.execute);

router.get('/surveys', surveysController.index);
router.post('/surveys', surveysController.create);

router.post('/users', usersController.create);

export default router;
