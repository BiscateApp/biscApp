import dayjs from 'dayjs/esm';
import { IPortfolio } from 'app/entities/portfolio/portfolio.model';
import { TaskerValidation } from 'app/entities/enumerations/tasker-validation.model';

export interface ITasker {
  id: number;
  phoneNumber?: string | null;
  validation?: keyof typeof TaskerValidation | null;
  whenCreated?: dayjs.Dayjs | null;
  portfolio?: Pick<IPortfolio, 'id'> | null;
}

export type NewTasker = Omit<ITasker, 'id'> & { id: null };
