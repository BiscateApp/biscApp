import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IAddress, NewAddress } from '../address.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IAddress for edit and NewAddressFormGroupInput for create.
 */
type AddressFormGroupInput = IAddress | PartialWithRequiredKeyOf<NewAddress>;

type AddressFormDefaults = Pick<NewAddress, 'id' | 'isDefault'>;

type AddressFormGroupContent = {
  id: FormControl<IAddress['id'] | NewAddress['id']>;
  country: FormControl<IAddress['country']>;
  city: FormControl<IAddress['city']>;
  postalCode: FormControl<IAddress['postalCode']>;
  streetAddress: FormControl<IAddress['streetAddress']>;
  vatNumber: FormControl<IAddress['vatNumber']>;
  isDefault: FormControl<IAddress['isDefault']>;
};

export type AddressFormGroup = FormGroup<AddressFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class AddressFormService {
  createAddressFormGroup(address: AddressFormGroupInput = { id: null }): AddressFormGroup {
    const addressRawValue = {
      ...this.getFormDefaults(),
      ...address,
    };
    return new FormGroup<AddressFormGroupContent>({
      id: new FormControl(
        { value: addressRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      country: new FormControl(addressRawValue.country, {
        validators: [Validators.minLength(3), Validators.maxLength(20)],
      }),
      city: new FormControl(addressRawValue.city, {
        validators: [Validators.minLength(3), Validators.maxLength(20)],
      }),
      postalCode: new FormControl(addressRawValue.postalCode, {
        validators: [Validators.minLength(4), Validators.maxLength(20)],
      }),
      streetAddress: new FormControl(addressRawValue.streetAddress, {
        validators: [Validators.minLength(3), Validators.maxLength(100)],
      }),
      vatNumber: new FormControl(addressRawValue.vatNumber, {
        validators: [Validators.minLength(9), Validators.maxLength(9)],
      }),
      isDefault: new FormControl(addressRawValue.isDefault),
    });
  }

  getAddress(form: AddressFormGroup): IAddress | NewAddress {
    return form.getRawValue() as IAddress | NewAddress;
  }

  resetForm(form: AddressFormGroup, address: AddressFormGroupInput): void {
    const addressRawValue = { ...this.getFormDefaults(), ...address };
    form.reset(
      {
        ...addressRawValue,
        id: { value: addressRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): AddressFormDefaults {
    return {
      id: null,
      isDefault: false,
    };
  }
}
