export interface IAddress {
  id: number;
  country?: string | null;
  city?: string | null;
  postalCode?: string | null;
  streetAddress?: string | null;
  vatNumber?: string | null;
  isDefault?: boolean | null;
}

export type NewAddress = Omit<IAddress, 'id'> & { id: null };
