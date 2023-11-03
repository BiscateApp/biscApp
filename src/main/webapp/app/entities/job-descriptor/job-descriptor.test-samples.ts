import { IJobDescriptor, NewJobDescriptor } from './job-descriptor.model';

export const sampleWithRequiredData: IJobDescriptor = {
  id: 26963,
};

export const sampleWithPartialData: IJobDescriptor = {
  id: 20887,
  description: 'Oeste Birmânia Norte',
};

export const sampleWithFullData: IJobDescriptor = {
  id: 28099,
  name: 'Este salmão Tavares',
  description: 'Frango',
};

export const sampleWithNewData: NewJobDescriptor = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
