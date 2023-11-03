import { IPortfolio } from 'app/entities/portfolio/portfolio.model';
import { IAddress } from 'app/entities/address/address.model';
import { IUser } from 'app/entities/user/user.model';
import { TaskerValidation } from 'app/entities/enumerations/tasker-validation.model';
import { TaskerType } from 'app/entities/enumerations/tasker-type.model';

export interface ITasker {
  id: number;
  phoneNumber?: string | null;
  validation?: keyof typeof TaskerValidation | null;
  taskerType?: keyof typeof TaskerType | null;
  portfolio?: Pick<IPortfolio, 'id'> | null;
  address?: Pick<IAddress, 'id'> | null;
  user?: Pick<IUser, 'id' | 'login'> | null;
}

export type NewTasker = Omit<ITasker, 'id'> & { id: null };
