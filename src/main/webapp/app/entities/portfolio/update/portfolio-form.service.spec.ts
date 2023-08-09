import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../portfolio.test-samples';

import { PortfolioFormService } from './portfolio-form.service';

describe('Portfolio Form Service', () => {
  let service: PortfolioFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PortfolioFormService);
  });

  describe('Service methods', () => {
    describe('createPortfolioFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createPortfolioFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            bio: expect.any(Object),
            skills: expect.any(Object),
            speakingLanguages: expect.any(Object),
            stars: expect.any(Object),
            completedTasks: expect.any(Object),
            hourlyRate: expect.any(Object),
          })
        );
      });

      it('passing IPortfolio should create a new form with FormGroup', () => {
        const formGroup = service.createPortfolioFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            bio: expect.any(Object),
            skills: expect.any(Object),
            speakingLanguages: expect.any(Object),
            stars: expect.any(Object),
            completedTasks: expect.any(Object),
            hourlyRate: expect.any(Object),
          })
        );
      });
    });

    describe('getPortfolio', () => {
      it('should return NewPortfolio for default Portfolio initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createPortfolioFormGroup(sampleWithNewData);

        const portfolio = service.getPortfolio(formGroup) as any;

        expect(portfolio).toMatchObject(sampleWithNewData);
      });

      it('should return NewPortfolio for empty Portfolio initial value', () => {
        const formGroup = service.createPortfolioFormGroup();

        const portfolio = service.getPortfolio(formGroup) as any;

        expect(portfolio).toMatchObject({});
      });

      it('should return IPortfolio', () => {
        const formGroup = service.createPortfolioFormGroup(sampleWithRequiredData);

        const portfolio = service.getPortfolio(formGroup) as any;

        expect(portfolio).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IPortfolio should not enable id FormControl', () => {
        const formGroup = service.createPortfolioFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewPortfolio should disable id FormControl', () => {
        const formGroup = service.createPortfolioFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
