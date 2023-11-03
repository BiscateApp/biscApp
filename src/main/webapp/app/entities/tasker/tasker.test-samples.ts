import { TaskerValidation } from 'app/entities/enumerations/tasker-validation.model';
import { TaskerType } from 'app/entities/enumerations/tasker-type.model';

import { ITasker, NewTasker } from './tasker.model';

export const sampleWithRequiredData: ITasker = {
  id: 4205,
};

export const sampleWithPartialData: ITasker = {
  id: 22383,
  phoneNumber: 'Eva Frango',
  taskerType: 'TASKPOSTER',
};

export const sampleWithFullData: ITasker = {
  id: 8942,
  phoneNumber: 'VirgensXX',
  validation: 'ONGOING',
  taskerType: 'TASKDOER',
};

export const sampleWithNewData: NewTasker = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
