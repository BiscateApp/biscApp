import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { JobDescriptorFormService } from './job-descriptor-form.service';
import { JobDescriptorService } from '../service/job-descriptor.service';
import { IJobDescriptor } from '../job-descriptor.model';
import { IPortfolio } from 'app/entities/portfolio/portfolio.model';
import { PortfolioService } from 'app/entities/portfolio/service/portfolio.service';

import { JobDescriptorUpdateComponent } from './job-descriptor-update.component';

describe('JobDescriptor Management Update Component', () => {
  let comp: JobDescriptorUpdateComponent;
  let fixture: ComponentFixture<JobDescriptorUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let jobDescriptorFormService: JobDescriptorFormService;
  let jobDescriptorService: JobDescriptorService;
  let portfolioService: PortfolioService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), JobDescriptorUpdateComponent],
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
      .overrideTemplate(JobDescriptorUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(JobDescriptorUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    jobDescriptorFormService = TestBed.inject(JobDescriptorFormService);
    jobDescriptorService = TestBed.inject(JobDescriptorService);
    portfolioService = TestBed.inject(PortfolioService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Portfolio query and add missing value', () => {
      const jobDescriptor: IJobDescriptor = { id: 456 };
      const portfolio: IPortfolio = { id: 14092 };
      jobDescriptor.portfolio = portfolio;

      const portfolioCollection: IPortfolio[] = [{ id: 3458 }];
      jest.spyOn(portfolioService, 'query').mockReturnValue(of(new HttpResponse({ body: portfolioCollection })));
      const additionalPortfolios = [portfolio];
      const expectedCollection: IPortfolio[] = [...additionalPortfolios, ...portfolioCollection];
      jest.spyOn(portfolioService, 'addPortfolioToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ jobDescriptor });
      comp.ngOnInit();

      expect(portfolioService.query).toHaveBeenCalled();
      expect(portfolioService.addPortfolioToCollectionIfMissing).toHaveBeenCalledWith(
        portfolioCollection,
        ...additionalPortfolios.map(expect.objectContaining)
      );
      expect(comp.portfoliosSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const jobDescriptor: IJobDescriptor = { id: 456 };
      const portfolio: IPortfolio = { id: 14845 };
      jobDescriptor.portfolio = portfolio;

      activatedRoute.data = of({ jobDescriptor });
      comp.ngOnInit();

      expect(comp.portfoliosSharedCollection).toContain(portfolio);
      expect(comp.jobDescriptor).toEqual(jobDescriptor);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IJobDescriptor>>();
      const jobDescriptor = { id: 123 };
      jest.spyOn(jobDescriptorFormService, 'getJobDescriptor').mockReturnValue(jobDescriptor);
      jest.spyOn(jobDescriptorService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ jobDescriptor });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: jobDescriptor }));
      saveSubject.complete();

      // THEN
      expect(jobDescriptorFormService.getJobDescriptor).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(jobDescriptorService.update).toHaveBeenCalledWith(expect.objectContaining(jobDescriptor));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IJobDescriptor>>();
      const jobDescriptor = { id: 123 };
      jest.spyOn(jobDescriptorFormService, 'getJobDescriptor').mockReturnValue({ id: null });
      jest.spyOn(jobDescriptorService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ jobDescriptor: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: jobDescriptor }));
      saveSubject.complete();

      // THEN
      expect(jobDescriptorFormService.getJobDescriptor).toHaveBeenCalled();
      expect(jobDescriptorService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IJobDescriptor>>();
      const jobDescriptor = { id: 123 };
      jest.spyOn(jobDescriptorService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ jobDescriptor });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(jobDescriptorService.update).toHaveBeenCalled();
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
  });
});
