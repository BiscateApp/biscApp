import { IAddress, NewAddress } from './address.model';

export const sampleWithRequiredData: IAddress = {
  id: 15739,
};

export const sampleWithPartialData: IAddress = {
  id: 13636,
  streetAddress: 'Sudeste Sudeste',
  vatNumber: 'ameixaXXX',
  isDefault: true,
};

export const sampleWithFullData: IAddress = {
  id: 19147,
  country: 'Haiti',
  city: 'Coimbra',
  postalCode: 'Sudeste',
  streetAddress: 'Jibuti Angola Mercearia',
  vatNumber: 'Sudeste C',
  isDefault: true,
};

export const sampleWithNewData: NewAddress = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
