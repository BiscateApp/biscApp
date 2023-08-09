export interface IClient {
  id: number;
  phoneNumber?: string | null;
}

export type NewClient = Omit<IClient, 'id'> & { id: null };
