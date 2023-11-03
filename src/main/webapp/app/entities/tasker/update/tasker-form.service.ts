import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { ITasker, NewTasker } from '../tasker.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ITasker for edit and NewTaskerFormGroupInput for create.
 */
type TaskerFormGroupInput = ITasker | PartialWithRequiredKeyOf<NewTasker>;

type TaskerFormDefaults = Pick<NewTasker, 'id'>;

type TaskerFormGroupContent = {
  id: FormControl<ITasker['id'] | NewTasker['id']>;
  phoneNumber: FormControl<ITasker['phoneNumber']>;
  validation: FormControl<ITasker['validation']>;
  taskerType: FormControl<ITasker['taskerType']>;
  portfolio: FormControl<ITasker['portfolio']>;
  address: FormControl<ITasker['address']>;
  user: FormControl<ITasker['user']>;
};

export type TaskerFormGroup = FormGroup<TaskerFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class TaskerFormService {
  createTaskerFormGroup(tasker: TaskerFormGroupInput = { id: null }): TaskerFormGroup {
    const taskerRawValue = {
      ...this.getFormDefaults(),
      ...tasker,
    };
    return new FormGroup<TaskerFormGroupContent>({
      id: new FormControl(
        { value: taskerRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      phoneNumber: new FormControl(taskerRawValue.phoneNumber, {
        validators: [Validators.minLength(9), Validators.maxLength(13)],
      }),
      validation: new FormControl(taskerRawValue.validation),
      taskerType: new FormControl(taskerRawValue.taskerType),
      portfolio: new FormControl(taskerRawValue.portfolio),
      address: new FormControl(taskerRawValue.address),
      user: new FormControl(taskerRawValue.user),
    });
  }

  getTasker(form: TaskerFormGroup): ITasker | NewTasker {
    return form.getRawValue() as ITasker | NewTasker;
  }

  resetForm(form: TaskerFormGroup, tasker: TaskerFormGroupInput): void {
    const taskerRawValue = { ...this.getFormDefaults(), ...tasker };
    form.reset(
      {
        ...taskerRawValue,
        id: { value: taskerRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): TaskerFormDefaults {
    return {
      id: null,
    };
  }
}
