import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
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

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends ITasker | NewTasker> = Omit<T, 'whenCreated'> & {
  whenCreated?: string | null;
};

type TaskerFormRawValue = FormValueOf<ITasker>;

type NewTaskerFormRawValue = FormValueOf<NewTasker>;

type TaskerFormDefaults = Pick<NewTasker, 'id' | 'whenCreated'>;

type TaskerFormGroupContent = {
  id: FormControl<TaskerFormRawValue['id'] | NewTasker['id']>;
  phoneNumber: FormControl<TaskerFormRawValue['phoneNumber']>;
  validation: FormControl<TaskerFormRawValue['validation']>;
  whenCreated: FormControl<TaskerFormRawValue['whenCreated']>;
  portfolio: FormControl<TaskerFormRawValue['portfolio']>;
};

export type TaskerFormGroup = FormGroup<TaskerFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class TaskerFormService {
  createTaskerFormGroup(tasker: TaskerFormGroupInput = { id: null }): TaskerFormGroup {
    const taskerRawValue = this.convertTaskerToTaskerRawValue({
      ...this.getFormDefaults(),
      ...tasker,
    });
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
      whenCreated: new FormControl(taskerRawValue.whenCreated, {
        validators: [Validators.required],
      }),
      portfolio: new FormControl(taskerRawValue.portfolio),
    });
  }

  getTasker(form: TaskerFormGroup): ITasker | NewTasker {
    return this.convertTaskerRawValueToTasker(form.getRawValue() as TaskerFormRawValue | NewTaskerFormRawValue);
  }

  resetForm(form: TaskerFormGroup, tasker: TaskerFormGroupInput): void {
    const taskerRawValue = this.convertTaskerToTaskerRawValue({ ...this.getFormDefaults(), ...tasker });
    form.reset(
      {
        ...taskerRawValue,
        id: { value: taskerRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): TaskerFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      whenCreated: currentTime,
    };
  }

  private convertTaskerRawValueToTasker(rawTasker: TaskerFormRawValue | NewTaskerFormRawValue): ITasker | NewTasker {
    return {
      ...rawTasker,
      whenCreated: dayjs(rawTasker.whenCreated, DATE_TIME_FORMAT),
    };
  }

  private convertTaskerToTaskerRawValue(
    tasker: ITasker | (Partial<NewTasker> & TaskerFormDefaults)
  ): TaskerFormRawValue | PartialWithRequiredKeyOf<NewTaskerFormRawValue> {
    return {
      ...tasker,
      whenCreated: tasker.whenCreated ? tasker.whenCreated.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
