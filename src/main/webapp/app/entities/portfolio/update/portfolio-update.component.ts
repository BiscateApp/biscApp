import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { PortfolioFormService, PortfolioFormGroup } from './portfolio-form.service';
import { IPortfolio } from '../portfolio.model';
import { PortfolioService } from '../service/portfolio.service';

@Component({
  standalone: true,
  selector: 'jhi-portfolio-update',
  templateUrl: './portfolio-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class PortfolioUpdateComponent implements OnInit {
  isSaving = false;
  portfolio: IPortfolio | null = null;

  editForm: PortfolioFormGroup = this.portfolioFormService.createPortfolioFormGroup();

  constructor(
    protected portfolioService: PortfolioService,
    protected portfolioFormService: PortfolioFormService,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ portfolio }) => {
      this.portfolio = portfolio;
      if (portfolio) {
        this.updateForm(portfolio);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const portfolio = this.portfolioFormService.getPortfolio(this.editForm);
    if (portfolio.id !== null) {
      this.subscribeToSaveResponse(this.portfolioService.update(portfolio));
    } else {
      this.subscribeToSaveResponse(this.portfolioService.create(portfolio));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IPortfolio>>): void {
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

  protected updateForm(portfolio: IPortfolio): void {
    this.portfolio = portfolio;
    this.portfolioFormService.resetForm(this.editForm, portfolio);
  }
}
