import { Request, Response } from 'express';
import { resolve } from 'path';
import { getCustomRepository } from 'typeorm';

import { AppError } from '../errors/AppError';
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
      throw new AppError('User does not exists');
    }

    const survey = await surveysRepository.findOne({
      id: survey_id
    });

    if (!survey) {
      throw new AppError('Survey does not exists');
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
      id: '',
      title: survey.title
    };

    if (surveyUserAlreadyExists) {
      variables.id = surveyUserAlreadyExists.id;

      await sendMailService.execute(email, survey.title, variables, npsPath);

      return response.json(surveyUserAlreadyExists);
    }

    const surveyUser = surveysUsersRepository.create({
      survey_id,
      user_id: user.id
    });

    await surveysUsersRepository.save(surveyUser);

    variables.id = surveyUser.id;

    await sendMailService.execute(email, survey.title, variables, npsPath);

    response.status(201).json(surveyUser);
  }
}
