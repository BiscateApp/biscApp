import { IPortfolio } from 'app/entities/portfolio/portfolio.model';

export interface IJobDescriptor {
  id: number;
  name?: string | null;
  description?: string | null;
  portfolio?: Pick<IPortfolio, 'id'> | null;
}

export type NewJobDescriptor = Omit<IJobDescriptor, 'id'> & { id: null };
