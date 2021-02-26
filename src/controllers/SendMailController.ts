import { Request, Response } from 'express';
import { resolve } from 'path';
import { getCustomRepository } from 'typeorm';

import { SurveysRepository } from '../repositories/SurveysRepository';
import { SurveysUsersRepository } from '../repositories/SurveysUsersRepository';
import { UsersRepository } from '../repositories/UsersRepository';
import sendMailService from '../services/SendMailService';

export class SendMailController {
  async execute(request: Request, response: Response) {
    const { email, survey_id } = request.body;

    const surveysRepository = getCustomRepository(SurveysRepository);
    const surveysUsersRepository = getCustomRepository(SurveysUsersRepository);
    const usersRepository = getCustomRepository(UsersRepository);

    const user = await usersRepository.findOne({
      email
    });

    if (!user) {
      return response.status(400).json({
        error: 'User does not exists'
      });
    }

    const survey = await surveysRepository.findOne({
      id: survey_id
    });

    if (!survey) {
      return response.status(400).json({
        error: 'Survey does not exists'
      });
    }

    const surveyUserAlreadyExists = await surveysUsersRepository.findOne({
      where: { survey_id: survey_id, user_id: user.id, value: null },
      relations: ['user', 'survey']
    });

    const npsPath = resolve(__dirname, '..', 'views', 'emails', 'npsMail.hbs');

    const variables = {
      description: survey.description,
      link: process.env.URL_MAIL,
      name: user.name,
      user_id: user.id,
      title: survey.title
    };

    if (surveyUserAlreadyExists) {
      await sendMailService.execute(email, survey.title, variables, npsPath);

      return response.json(surveyUserAlreadyExists);
    }

    const surveyUser = surveysUsersRepository.create({
      survey_id,
      user_id: user.id
    });

    await surveysUsersRepository.save(surveyUser);

    await sendMailService.execute(email, survey.title, variables, npsPath);

    response.status(201).json(surveyUser);
  }
}
