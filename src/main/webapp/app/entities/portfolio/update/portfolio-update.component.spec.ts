import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { PortfolioFormService } from './portfolio-form.service';
import { PortfolioService } from '../service/portfolio.service';
import { IPortfolio } from '../portfolio.model';

import { PortfolioUpdateComponent } from './portfolio-update.component';

describe('Portfolio Management Update Component', () => {
  let comp: PortfolioUpdateComponent;
  let fixture: ComponentFixture<PortfolioUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let portfolioFormService: PortfolioFormService;
  let portfolioService: PortfolioService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), PortfolioUpdateComponent],
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
      .overrideTemplate(PortfolioUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(PortfolioUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    portfolioFormService = TestBed.inject(PortfolioFormService);
    portfolioService = TestBed.inject(PortfolioService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const portfolio: IPortfolio = { id: 456 };

      activatedRoute.data = of({ portfolio });
      comp.ngOnInit();

      expect(comp.portfolio).toEqual(portfolio);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IPortfolio>>();
      const portfolio = { id: 123 };
      jest.spyOn(portfolioFormService, 'getPortfolio').mockReturnValue(portfolio);
      jest.spyOn(portfolioService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ portfolio });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: portfolio }));
      saveSubject.complete();

      // THEN
      expect(portfolioFormService.getPortfolio).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(portfolioService.update).toHaveBeenCalledWith(expect.objectContaining(portfolio));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IPortfolio>>();
      const portfolio = { id: 123 };
      jest.spyOn(portfolioFormService, 'getPortfolio').mockReturnValue({ id: null });
      jest.spyOn(portfolioService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ portfolio: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: portfolio }));
      saveSubject.complete();

      // THEN
      expect(portfolioFormService.getPortfolio).toHaveBeenCalled();
      expect(portfolioService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IPortfolio>>();
      const portfolio = { id: 123 };
      jest.spyOn(portfolioService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ portfolio });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(portfolioService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
