import dayjs from 'dayjs/esm';

import { JobStatus } from 'app/entities/enumerations/job-status.model';

import { IJob, NewJob } from './job.model';

export const sampleWithRequiredData: IJob = {
  id: 23881,
};

export const sampleWithPartialData: IJob = {
  id: 4666,
  description: 'Inteligente Martinica',
  date: dayjs('2023-11-03T10:28'),
  whenCreated: dayjs('2023-11-02T23:13'),
  whenUpdated: dayjs('2023-11-02T19:34'),
};

export const sampleWithFullData: IJob = {
  id: 9190,
  description: 'laranja azul Tonga',
  date: dayjs('2023-11-02T14:45'),
  status: 'COMPLETED',
  whenCreated: dayjs('2023-11-03T01:54'),
  whenUpdated: dayjs('2023-11-03T01:26'),
};

export const sampleWithNewData: NewJob = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
