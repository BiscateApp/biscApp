import { IPortfolio, NewPortfolio } from './portfolio.model';

export const sampleWithRequiredData: IPortfolio = {
  id: 30409,
};

export const sampleWithPartialData: IPortfolio = {
  id: 146,
  bio: 'TecladoXXX',
  skills: 'orquídea Bicicleta Marrocos',
  speakingLanguages: 'Sodoeste branco',
  completedTasks: 3228,
  hourlyRate: 20894,
};

export const sampleWithFullData: IPortfolio = {
  id: 12182,
  bio: 'Toalhas Malta Rústico',
  skills: 'Linda magenta',
  speakingLanguages: 'Viela',
  stars: 916,
  completedTasks: 695,
  hourlyRate: 16755,
};

export const sampleWithNewData: NewPortfolio = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
