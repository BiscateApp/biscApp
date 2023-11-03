import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IJob, NewJob } from '../job.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IJob for edit and NewJobFormGroupInput for create.
 */
type JobFormGroupInput = IJob | PartialWithRequiredKeyOf<NewJob>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IJob | NewJob> = Omit<T, 'date' | 'whenCreated' | 'whenUpdated'> & {
  date?: string | null;
  whenCreated?: string | null;
  whenUpdated?: string | null;
};

type JobFormRawValue = FormValueOf<IJob>;

type NewJobFormRawValue = FormValueOf<NewJob>;

type JobFormDefaults = Pick<NewJob, 'id' | 'date' | 'whenCreated' | 'whenUpdated'>;

type JobFormGroupContent = {
  id: FormControl<JobFormRawValue['id'] | NewJob['id']>;
  description: FormControl<JobFormRawValue['description']>;
  date: FormControl<JobFormRawValue['date']>;
  status: FormControl<JobFormRawValue['status']>;
  whenCreated: FormControl<JobFormRawValue['whenCreated']>;
  whenUpdated: FormControl<JobFormRawValue['whenUpdated']>;
  location: FormControl<JobFormRawValue['location']>;
  descriptor: FormControl<JobFormRawValue['descriptor']>;
  jobDoer: FormControl<JobFormRawValue['jobDoer']>;
};

export type JobFormGroup = FormGroup<JobFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class JobFormService {
  createJobFormGroup(job: JobFormGroupInput = { id: null }): JobFormGroup {
    const jobRawValue = this.convertJobToJobRawValue({
      ...this.getFormDefaults(),
      ...job,
    });
    return new FormGroup<JobFormGroupContent>({
      id: new FormControl(
        { value: jobRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      description: new FormControl(jobRawValue.description, {
        validators: [Validators.minLength(3), Validators.maxLength(500)],
      }),
      date: new FormControl(jobRawValue.date),
      status: new FormControl(jobRawValue.status),
      whenCreated: new FormControl(jobRawValue.whenCreated),
      whenUpdated: new FormControl(jobRawValue.whenUpdated),
      location: new FormControl(jobRawValue.location),
      descriptor: new FormControl(jobRawValue.descriptor),
      jobDoer: new FormControl(jobRawValue.jobDoer),
    });
  }

  getJob(form: JobFormGroup): IJob | NewJob {
    return this.convertJobRawValueToJob(form.getRawValue() as JobFormRawValue | NewJobFormRawValue);
  }

  resetForm(form: JobFormGroup, job: JobFormGroupInput): void {
    const jobRawValue = this.convertJobToJobRawValue({ ...this.getFormDefaults(), ...job });
    form.reset(
      {
        ...jobRawValue,
        id: { value: jobRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): JobFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      date: currentTime,
      whenCreated: currentTime,
      whenUpdated: currentTime,
    };
  }

  private convertJobRawValueToJob(rawJob: JobFormRawValue | NewJobFormRawValue): IJob | NewJob {
    return {
      ...rawJob,
      date: dayjs(rawJob.date, DATE_TIME_FORMAT),
      whenCreated: dayjs(rawJob.whenCreated, DATE_TIME_FORMAT),
      whenUpdated: dayjs(rawJob.whenUpdated, DATE_TIME_FORMAT),
    };
  }

  private convertJobToJobRawValue(
    job: IJob | (Partial<NewJob> & JobFormDefaults)
  ): JobFormRawValue | PartialWithRequiredKeyOf<NewJobFormRawValue> {
    return {
      ...job,
      date: job.date ? job.date.format(DATE_TIME_FORMAT) : undefined,
      whenCreated: job.whenCreated ? job.whenCreated.format(DATE_TIME_FORMAT) : undefined,
      whenUpdated: job.whenUpdated ? job.whenUpdated.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
