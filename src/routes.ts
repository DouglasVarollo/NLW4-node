import { Router } from 'express';

import { AnswerController } from './controllers/AnswerController';
import { SendMailController } from './controllers/SendMailController';
import { SurveysController } from './controllers/SurveysController';
import { UsersController } from './controllers/UsersController';

const answerController = new AnswerController();
const sendMailController = new SendMailController();
const surveysController = new SurveysController();
const usersController = new UsersController();
const router = Router();

router.get('/answers/:value', answerController.execute);

router.post('/sendMail', sendMailController.execute);

router.get('/surveys', surveysController.index);
router.post('/surveys', surveysController.create);

router.post('/users', usersController.create);

export default router;
