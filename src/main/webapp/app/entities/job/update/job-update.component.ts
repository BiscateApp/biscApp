import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { JobFormService, JobFormGroup } from './job-form.service';
import { IJob } from '../job.model';
import { JobService } from '../service/job.service';
import { IAddress } from 'app/entities/address/address.model';
import { AddressService } from 'app/entities/address/service/address.service';
import { IJobDescriptor } from 'app/entities/job-descriptor/job-descriptor.model';
import { JobDescriptorService } from 'app/entities/job-descriptor/service/job-descriptor.service';
import { ITasker } from 'app/entities/tasker/tasker.model';
import { TaskerService } from 'app/entities/tasker/service/tasker.service';
import { JobStatus } from 'app/entities/enumerations/job-status.model';

@Component({
  standalone: true,
  selector: 'jhi-job-update',
  templateUrl: './job-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class JobUpdateComponent implements OnInit {
  isSaving = false;
  job: IJob | null = null;
  jobStatusValues = Object.keys(JobStatus);

  locationsCollection: IAddress[] = [];
  descriptorsCollection: IJobDescriptor[] = [];
  taskersSharedCollection: ITasker[] = [];

  editForm: JobFormGroup = this.jobFormService.createJobFormGroup();

  constructor(
    protected jobService: JobService,
    protected jobFormService: JobFormService,
    protected addressService: AddressService,
    protected jobDescriptorService: JobDescriptorService,
    protected taskerService: TaskerService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareAddress = (o1: IAddress | null, o2: IAddress | null): boolean => this.addressService.compareAddress(o1, o2);

  compareJobDescriptor = (o1: IJobDescriptor | null, o2: IJobDescriptor | null): boolean =>
    this.jobDescriptorService.compareJobDescriptor(o1, o2);

  compareTasker = (o1: ITasker | null, o2: ITasker | null): boolean => this.taskerService.compareTasker(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ job }) => {
      this.job = job;
      if (job) {
        this.updateForm(job);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const job = this.jobFormService.getJob(this.editForm);
    if (job.id !== null) {
      this.subscribeToSaveResponse(this.jobService.update(job));
    } else {
      this.subscribeToSaveResponse(this.jobService.create(job));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IJob>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(job: IJob): void {
    this.job = job;
    this.jobFormService.resetForm(this.editForm, job);

    this.locationsCollection = this.addressService.addAddressToCollectionIfMissing<IAddress>(this.locationsCollection, job.location);
    this.descriptorsCollection = this.jobDescriptorService.addJobDescriptorToCollectionIfMissing<IJobDescriptor>(
      this.descriptorsCollection,
      job.descriptor
    );
    this.taskersSharedCollection = this.taskerService.addTaskerToCollectionIfMissing<ITasker>(this.taskersSharedCollection, job.jobDoer);
  }

  protected loadRelationshipsOptions(): void {
    this.addressService
      .query({ filter: 'job-is-null' })
      .pipe(map((res: HttpResponse<IAddress[]>) => res.body ?? []))
      .pipe(map((addresses: IAddress[]) => this.addressService.addAddressToCollectionIfMissing<IAddress>(addresses, this.job?.location)))
      .subscribe((addresses: IAddress[]) => (this.locationsCollection = addresses));

    this.jobDescriptorService
      .query({ filter: 'job-is-null' })
      .pipe(map((res: HttpResponse<IJobDescriptor[]>) => res.body ?? []))
      .pipe(
        map((jobDescriptors: IJobDescriptor[]) =>
          this.jobDescriptorService.addJobDescriptorToCollectionIfMissing<IJobDescriptor>(jobDescriptors, this.job?.descriptor)
        )
      )
      .subscribe((jobDescriptors: IJobDescriptor[]) => (this.descriptorsCollection = jobDescriptors));

    this.taskerService
      .query()
      .pipe(map((res: HttpResponse<ITasker[]>) => res.body ?? []))
      .pipe(map((taskers: ITasker[]) => this.taskerService.addTaskerToCollectionIfMissing<ITasker>(taskers, this.job?.jobDoer)))
      .subscribe((taskers: ITasker[]) => (this.taskersSharedCollection = taskers));
  }
}
