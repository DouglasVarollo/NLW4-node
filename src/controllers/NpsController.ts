import { Request, Response } from 'express';
import { getCustomRepository, Not, IsNull } from 'typeorm';

import { SurveysUsersRepository } from '../repositories/SurveysUsersRepository';

export class NpsController {
  async execute(request: Request, response: Response) {
    const { survey_id } = request.params;

    const surveysUsersRepository = getCustomRepository(SurveysUsersRepository);

    const surveysUsers = await surveysUsersRepository.find({
      survey_id,
      value: Not(IsNull())
    });

    const detractor = surveysUsers.filter(function (survey) {
      return survey.value >= 0 && survey.value <= 6;
    }).length;

    const passive = surveysUsers.filter(function (survey) {
      return survey.value >= 7 && survey.value <= 8;
    }).length;

    const promoters = surveysUsers.filter(function (survey) {
      return survey.value >= 9 && survey.value <= 10;
    }).length;

    const totalAnswers = surveysUsers.length;

    const calculate = Number(
      (((promoters - detractor) / totalAnswers) * 100).toFixed(2)
    );

    response.json({
      detractor,
      nps: calculate,
      passive,
      promoters,
      totalAnswers
    });
  }
}
