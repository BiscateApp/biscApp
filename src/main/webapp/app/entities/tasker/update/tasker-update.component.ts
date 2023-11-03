import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { TaskerFormService, TaskerFormGroup } from './tasker-form.service';
import { ITasker } from '../tasker.model';
import { TaskerService } from '../service/tasker.service';
import { IPortfolio } from 'app/entities/portfolio/portfolio.model';
import { PortfolioService } from 'app/entities/portfolio/service/portfolio.service';
import { IAddress } from 'app/entities/address/address.model';
import { AddressService } from 'app/entities/address/service/address.service';
import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';
import { TaskerValidation } from 'app/entities/enumerations/tasker-validation.model';
import { TaskerType } from 'app/entities/enumerations/tasker-type.model';

@Component({
  standalone: true,
  selector: 'jhi-tasker-update',
  templateUrl: './tasker-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class TaskerUpdateComponent implements OnInit {
  isSaving = false;
  tasker: ITasker | null = null;
  taskerValidationValues = Object.keys(TaskerValidation);
  taskerTypeValues = Object.keys(TaskerType);

  portfoliosCollection: IPortfolio[] = [];
  addressesCollection: IAddress[] = [];
  usersSharedCollection: IUser[] = [];

  editForm: TaskerFormGroup = this.taskerFormService.createTaskerFormGroup();

  constructor(
    protected taskerService: TaskerService,
    protected taskerFormService: TaskerFormService,
    protected portfolioService: PortfolioService,
    protected addressService: AddressService,
    protected userService: UserService,
    protected activatedRoute: ActivatedRoute
  ) {}

  comparePortfolio = (o1: IPortfolio | null, o2: IPortfolio | null): boolean => this.portfolioService.comparePortfolio(o1, o2);

  compareAddress = (o1: IAddress | null, o2: IAddress | null): boolean => this.addressService.compareAddress(o1, o2);

  compareUser = (o1: IUser | null, o2: IUser | null): boolean => this.userService.compareUser(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ tasker }) => {
      this.tasker = tasker;
      if (tasker) {
        this.updateForm(tasker);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const tasker = this.taskerFormService.getTasker(this.editForm);
    if (tasker.id !== null) {
      this.subscribeToSaveResponse(this.taskerService.update(tasker));
    } else {
      this.subscribeToSaveResponse(this.taskerService.create(tasker));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ITasker>>): void {
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

  protected updateForm(tasker: ITasker): void {
    this.tasker = tasker;
    this.taskerFormService.resetForm(this.editForm, tasker);

    this.portfoliosCollection = this.portfolioService.addPortfolioToCollectionIfMissing<IPortfolio>(
      this.portfoliosCollection,
      tasker.portfolio
    );
    this.addressesCollection = this.addressService.addAddressToCollectionIfMissing<IAddress>(this.addressesCollection, tasker.address);
    this.usersSharedCollection = this.userService.addUserToCollectionIfMissing<IUser>(this.usersSharedCollection, tasker.user);
  }

  protected loadRelationshipsOptions(): void {
    this.portfolioService
      .query({ filter: 'tasker-is-null' })
      .pipe(map((res: HttpResponse<IPortfolio[]>) => res.body ?? []))
      .pipe(
        map((portfolios: IPortfolio[]) =>
          this.portfolioService.addPortfolioToCollectionIfMissing<IPortfolio>(portfolios, this.tasker?.portfolio)
        )
      )
      .subscribe((portfolios: IPortfolio[]) => (this.portfoliosCollection = portfolios));

    this.addressService
      .query({ filter: 'tasker-is-null' })
      .pipe(map((res: HttpResponse<IAddress[]>) => res.body ?? []))
      .pipe(map((addresses: IAddress[]) => this.addressService.addAddressToCollectionIfMissing<IAddress>(addresses, this.tasker?.address)))
      .subscribe((addresses: IAddress[]) => (this.addressesCollection = addresses));

    this.userService
      .query()
      .pipe(map((res: HttpResponse<IUser[]>) => res.body ?? []))
      .pipe(map((users: IUser[]) => this.userService.addUserToCollectionIfMissing<IUser>(users, this.tasker?.user)))
      .subscribe((users: IUser[]) => (this.usersSharedCollection = users));
  }
}
