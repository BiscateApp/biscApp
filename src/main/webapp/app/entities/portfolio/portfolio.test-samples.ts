import { IPortfolio, NewPortfolio } from './portfolio.model';

export const sampleWithRequiredData: IPortfolio = {
  id: 30504,
};

export const sampleWithPartialData: IPortfolio = {
  id: 9691,
  skills: 'CaetanaXXX',
  stars: 833,
  hourlyRate: 870,
};

export const sampleWithFullData: IPortfolio = {
  id: 12467,
  bio: 'Calças Salomão Pinto',
  skills: 'Ladeira Sudeste',
  speakingLanguages: 'Linda Carolina',
  stars: 275,
  completedTasks: 4761,
  hourlyRate: 48,
};

export const sampleWithNewData: NewPortfolio = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
