import dayjs from 'dayjs/esm';

import { TaskerValidation } from 'app/entities/enumerations/tasker-validation.model';

import { ITasker, NewTasker } from './tasker.model';

export const sampleWithRequiredData: ITasker = {
  id: 11580,
  whenCreated: dayjs('2023-08-09T00:16'),
};

export const sampleWithPartialData: ITasker = {
  id: 25323,
  phoneNumber: 'CroáciaXX',
  whenCreated: dayjs('2023-08-09T10:31'),
};

export const sampleWithFullData: ITasker = {
  id: 27191,
  phoneNumber: 'Salada Bacon ',
  validation: 'FAILED',
  whenCreated: dayjs('2023-08-09T04:46'),
};

export const sampleWithNewData: NewTasker = {
  whenCreated: dayjs('2023-08-09T17:32'),
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
