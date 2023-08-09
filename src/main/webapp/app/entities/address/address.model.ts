import { IClient } from 'app/entities/client/client.model';
import { ITasker } from 'app/entities/tasker/tasker.model';

export interface IAddress {
  id: number;
  country?: string | null;
  city?: string | null;
  postalCode?: string | null;
  streetAddress?: string | null;
  vatNumber?: string | null;
  isDefault?: boolean | null;
  client?: Pick<IClient, 'id'> | null;
  tasker?: Pick<ITasker, 'id'> | null;
}

export type NewAddress = Omit<IAddress, 'id'> & { id: null };
