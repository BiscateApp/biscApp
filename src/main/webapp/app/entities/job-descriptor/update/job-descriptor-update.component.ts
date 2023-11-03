import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { JobDescriptorFormService, JobDescriptorFormGroup } from './job-descriptor-form.service';
import { IJobDescriptor } from '../job-descriptor.model';
import { JobDescriptorService } from '../service/job-descriptor.service';
import { IPortfolio } from 'app/entities/portfolio/portfolio.model';
import { PortfolioService } from 'app/entities/portfolio/service/portfolio.service';

@Component({
  standalone: true,
  selector: 'jhi-job-descriptor-update',
  templateUrl: './job-descriptor-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class JobDescriptorUpdateComponent implements OnInit {
  isSaving = false;
  jobDescriptor: IJobDescriptor | null = null;

  portfoliosSharedCollection: IPortfolio[] = [];

  editForm: JobDescriptorFormGroup = this.jobDescriptorFormService.createJobDescriptorFormGroup();

  constructor(
    protected jobDescriptorService: JobDescriptorService,
    protected jobDescriptorFormService: JobDescriptorFormService,
    protected portfolioService: PortfolioService,
    protected activatedRoute: ActivatedRoute
  ) {}

  comparePortfolio = (o1: IPortfolio | null, o2: IPortfolio | null): boolean => this.portfolioService.comparePortfolio(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ jobDescriptor }) => {
      this.jobDescriptor = jobDescriptor;
      if (jobDescriptor) {
        this.updateForm(jobDescriptor);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const jobDescriptor = this.jobDescriptorFormService.getJobDescriptor(this.editForm);
    if (jobDescriptor.id !== null) {
      this.subscribeToSaveResponse(this.jobDescriptorService.update(jobDescriptor));
    } else {
      this.subscribeToSaveResponse(this.jobDescriptorService.create(jobDescriptor));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IJobDescriptor>>): void {
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

  protected updateForm(jobDescriptor: IJobDescriptor): void {
    this.jobDescriptor = jobDescriptor;
    this.jobDescriptorFormService.resetForm(this.editForm, jobDescriptor);

    this.portfoliosSharedCollection = this.portfolioService.addPortfolioToCollectionIfMissing<IPortfolio>(
      this.portfoliosSharedCollection,
      jobDescriptor.portfolio
    );
  }

  protected loadRelationshipsOptions(): void {
    this.portfolioService
      .query()
      .pipe(map((res: HttpResponse<IPortfolio[]>) => res.body ?? []))
      .pipe(
        map((portfolios: IPortfolio[]) =>
          this.portfolioService.addPortfolioToCollectionIfMissing<IPortfolio>(portfolios, this.jobDescriptor?.portfolio)
        )
      )
      .subscribe((portfolios: IPortfolio[]) => (this.portfoliosSharedCollection = portfolios));
  }
}
