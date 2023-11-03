import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../job-descriptor.test-samples';

import { JobDescriptorFormService } from './job-descriptor-form.service';

describe('JobDescriptor Form Service', () => {
  let service: JobDescriptorFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JobDescriptorFormService);
  });

  describe('Service methods', () => {
    describe('createJobDescriptorFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createJobDescriptorFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            description: expect.any(Object),
            portfolio: expect.any(Object),
          })
        );
      });

      it('passing IJobDescriptor should create a new form with FormGroup', () => {
        const formGroup = service.createJobDescriptorFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            description: expect.any(Object),
            portfolio: expect.any(Object),
          })
        );
      });
    });

    describe('getJobDescriptor', () => {
      it('should return NewJobDescriptor for default JobDescriptor initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createJobDescriptorFormGroup(sampleWithNewData);

        const jobDescriptor = service.getJobDescriptor(formGroup) as any;

        expect(jobDescriptor).toMatchObject(sampleWithNewData);
      });

      it('should return NewJobDescriptor for empty JobDescriptor initial value', () => {
        const formGroup = service.createJobDescriptorFormGroup();

        const jobDescriptor = service.getJobDescriptor(formGroup) as any;

        expect(jobDescriptor).toMatchObject({});
      });

      it('should return IJobDescriptor', () => {
        const formGroup = service.createJobDescriptorFormGroup(sampleWithRequiredData);

        const jobDescriptor = service.getJobDescriptor(formGroup) as any;

        expect(jobDescriptor).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IJobDescriptor should not enable id FormControl', () => {
        const formGroup = service.createJobDescriptorFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewJobDescriptor should disable id FormControl', () => {
        const formGroup = service.createJobDescriptorFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
