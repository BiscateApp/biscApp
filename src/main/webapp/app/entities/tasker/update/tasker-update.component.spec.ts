import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { TaskerFormService } from './tasker-form.service';
import { TaskerService } from '../service/tasker.service';
import { ITasker } from '../tasker.model';
import { IPortfolio } from 'app/entities/portfolio/portfolio.model';
import { PortfolioService } from 'app/entities/portfolio/service/portfolio.service';
import { IAddress } from 'app/entities/address/address.model';
import { AddressService } from 'app/entities/address/service/address.service';

import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';

import { TaskerUpdateComponent } from './tasker-update.component';

describe('Tasker Management Update Component', () => {
  let comp: TaskerUpdateComponent;
  let fixture: ComponentFixture<TaskerUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let taskerFormService: TaskerFormService;
  let taskerService: TaskerService;
  let portfolioService: PortfolioService;
  let addressService: AddressService;
  let userService: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), TaskerUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(TaskerUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(TaskerUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    taskerFormService = TestBed.inject(TaskerFormService);
    taskerService = TestBed.inject(TaskerService);
    portfolioService = TestBed.inject(PortfolioService);
    addressService = TestBed.inject(AddressService);
    userService = TestBed.inject(UserService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call portfolio query and add missing value', () => {
      const tasker: ITasker = { id: 456 };
      const portfolio: IPortfolio = { id: 5348 };
      tasker.portfolio = portfolio;

      const portfolioCollection: IPortfolio[] = [{ id: 26692 }];
      jest.spyOn(portfolioService, 'query').mockReturnValue(of(new HttpResponse({ body: portfolioCollection })));
      const expectedCollection: IPortfolio[] = [portfolio, ...portfolioCollection];
      jest.spyOn(portfolioService, 'addPortfolioToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ tasker });
      comp.ngOnInit();

      expect(portfolioService.query).toHaveBeenCalled();
      expect(portfolioService.addPortfolioToCollectionIfMissing).toHaveBeenCalledWith(portfolioCollection, portfolio);
      expect(comp.portfoliosCollection).toEqual(expectedCollection);
    });

    it('Should call address query and add missing value', () => {
      const tasker: ITasker = { id: 456 };
      const address: IAddress = { id: 8015 };
      tasker.address = address;

      const addressCollection: IAddress[] = [{ id: 5577 }];
      jest.spyOn(addressService, 'query').mockReturnValue(of(new HttpResponse({ body: addressCollection })));
      const expectedCollection: IAddress[] = [address, ...addressCollection];
      jest.spyOn(addressService, 'addAddressToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ tasker });
      comp.ngOnInit();

      expect(addressService.query).toHaveBeenCalled();
      expect(addressService.addAddressToCollectionIfMissing).toHaveBeenCalledWith(addressCollection, address);
      expect(comp.addressesCollection).toEqual(expectedCollection);
    });

    it('Should call User query and add missing value', () => {
      const tasker: ITasker = { id: 456 };
      const user: IUser = { id: 32248 };
      tasker.user = user;

      const userCollection: IUser[] = [{ id: 21183 }];
      jest.spyOn(userService, 'query').mockReturnValue(of(new HttpResponse({ body: userCollection })));
      const additionalUsers = [user];
      const expectedCollection: IUser[] = [...additionalUsers, ...userCollection];
      jest.spyOn(userService, 'addUserToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ tasker });
      comp.ngOnInit();

      expect(userService.query).toHaveBeenCalled();
      expect(userService.addUserToCollectionIfMissing).toHaveBeenCalledWith(
        userCollection,
        ...additionalUsers.map(expect.objectContaining)
      );
      expect(comp.usersSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const tasker: ITasker = { id: 456 };
      const portfolio: IPortfolio = { id: 22022 };
      tasker.portfolio = portfolio;
      const address: IAddress = { id: 32172 };
      tasker.address = address;
      const user: IUser = { id: 13681 };
      tasker.user = user;

      activatedRoute.data = of({ tasker });
      comp.ngOnInit();

      expect(comp.portfoliosCollection).toContain(portfolio);
      expect(comp.addressesCollection).toContain(address);
      expect(comp.usersSharedCollection).toContain(user);
      expect(comp.tasker).toEqual(tasker);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ITasker>>();
      const tasker = { id: 123 };
      jest.spyOn(taskerFormService, 'getTasker').mockReturnValue(tasker);
      jest.spyOn(taskerService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ tasker });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: tasker }));
      saveSubject.complete();

      // THEN
      expect(taskerFormService.getTasker).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(taskerService.update).toHaveBeenCalledWith(expect.objectContaining(tasker));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ITasker>>();
      const tasker = { id: 123 };
      jest.spyOn(taskerFormService, 'getTasker').mockReturnValue({ id: null });
      jest.spyOn(taskerService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ tasker: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: tasker }));
      saveSubject.complete();

      // THEN
      expect(taskerFormService.getTasker).toHaveBeenCalled();
      expect(taskerService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ITasker>>();
      const tasker = { id: 123 };
      jest.spyOn(taskerService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ tasker });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(taskerService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('comparePortfolio', () => {
      it('Should forward to portfolioService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(portfolioService, 'comparePortfolio');
        comp.comparePortfolio(entity, entity2);
        expect(portfolioService.comparePortfolio).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareAddress', () => {
      it('Should forward to addressService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(addressService, 'compareAddress');
        comp.compareAddress(entity, entity2);
        expect(addressService.compareAddress).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareUser', () => {
      it('Should forward to userService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(userService, 'compareUser');
        comp.compareUser(entity, entity2);
        expect(userService.compareUser).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
