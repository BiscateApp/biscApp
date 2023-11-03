import { IAddress, NewAddress } from './address.model';

export const sampleWithRequiredData: IAddress = {
  id: 20301,
};

export const sampleWithPartialData: IAddress = {
  id: 1872,
  city: 'Espinho',
  vatNumber: 'Artesanal',
  isDefault: true,
};

export const sampleWithFullData: IAddress = {
  id: 15414,
  country: 'Reunião',
  city: 'Mealhada',
  postalCode: 'Júlio Gabão',
  streetAddress: 'Madeira Sudeste',
  vatNumber: 'Ferrament',
  isDefault: false,
};

export const sampleWithNewData: NewAddress = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
