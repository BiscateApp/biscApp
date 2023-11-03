import dayjs from 'dayjs/esm';
import { IAddress } from 'app/entities/address/address.model';
import { IJobDescriptor } from 'app/entities/job-descriptor/job-descriptor.model';
import { ITasker } from 'app/entities/tasker/tasker.model';
import { JobStatus } from 'app/entities/enumerations/job-status.model';

export interface IJob {
  id: number;
  description?: string | null;
  date?: dayjs.Dayjs | null;
  status?: keyof typeof JobStatus | null;
  whenCreated?: dayjs.Dayjs | null;
  whenUpdated?: dayjs.Dayjs | null;
  location?: Pick<IAddress, 'id'> | null;
  descriptor?: Pick<IJobDescriptor, 'id'> | null;
  jobDoer?: Pick<ITasker, 'id'> | null;
}

export type NewJob = Omit<IJob, 'id'> & { id: null };
