import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IJobDescriptor, NewJobDescriptor } from '../job-descriptor.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IJobDescriptor for edit and NewJobDescriptorFormGroupInput for create.
 */
type JobDescriptorFormGroupInput = IJobDescriptor | PartialWithRequiredKeyOf<NewJobDescriptor>;

type JobDescriptorFormDefaults = Pick<NewJobDescriptor, 'id'>;

type JobDescriptorFormGroupContent = {
  id: FormControl<IJobDescriptor['id'] | NewJobDescriptor['id']>;
  name: FormControl<IJobDescriptor['name']>;
  description: FormControl<IJobDescriptor['description']>;
  portfolio: FormControl<IJobDescriptor['portfolio']>;
};

export type JobDescriptorFormGroup = FormGroup<JobDescriptorFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class JobDescriptorFormService {
  createJobDescriptorFormGroup(jobDescriptor: JobDescriptorFormGroupInput = { id: null }): JobDescriptorFormGroup {
    const jobDescriptorRawValue = {
      ...this.getFormDefaults(),
      ...jobDescriptor,
    };
    return new FormGroup<JobDescriptorFormGroupContent>({
      id: new FormControl(
        { value: jobDescriptorRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      name: new FormControl(jobDescriptorRawValue.name, {
        validators: [Validators.minLength(3), Validators.maxLength(20)],
      }),
      description: new FormControl(jobDescriptorRawValue.description, {
        validators: [Validators.minLength(3), Validators.maxLength(100)],
      }),
      portfolio: new FormControl(jobDescriptorRawValue.portfolio),
    });
  }

  getJobDescriptor(form: JobDescriptorFormGroup): IJobDescriptor | NewJobDescriptor {
    return form.getRawValue() as IJobDescriptor | NewJobDescriptor;
  }

  resetForm(form: JobDescriptorFormGroup, jobDescriptor: JobDescriptorFormGroupInput): void {
    const jobDescriptorRawValue = { ...this.getFormDefaults(), ...jobDescriptor };
    form.reset(
      {
        ...jobDescriptorRawValue,
        id: { value: jobDescriptorRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): JobDescriptorFormDefaults {
    return {
      id: null,
    };
  }
}
