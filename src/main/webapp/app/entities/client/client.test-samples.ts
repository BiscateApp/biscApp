import { IClient, NewClient } from './client.model';

export const sampleWithRequiredData: IClient = {
  id: 9617,
};

export const sampleWithPartialData: IClient = {
  id: 14776,
  phoneNumber: 'IncrívelX',
};

export const sampleWithFullData: IClient = {
  id: 31466,
  phoneNumber: 'violeta Sul',
};

export const sampleWithNewData: NewClient = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
