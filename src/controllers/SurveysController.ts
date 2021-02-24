import { getCustomRepository } from 'typeorm';

import { SurveysRepository } from '../repositories/SurveysRepository';

export class SurveysController {
  async index(request, response) {
    const surveysRepository = getCustomRepository(SurveysRepository);

    const surveys = await surveysRepository.find();

    response.json(surveys);
  }

  async create(request, response) {
    const { title, description } = request.body;

    const surveysRepository = getCustomRepository(SurveysRepository);

    const survey = surveysRepository.create({
      title,
      description
    });

    await surveysRepository.save(survey);

    response.status(201).json(survey);
  }
}
