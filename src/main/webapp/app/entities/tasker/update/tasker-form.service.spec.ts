import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../tasker.test-samples';

import { TaskerFormService } from './tasker-form.service';

describe('Tasker Form Service', () => {
  let service: TaskerFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TaskerFormService);
  });

  describe('Service methods', () => {
    describe('createTaskerFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createTaskerFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            phoneNumber: expect.any(Object),
            validation: expect.any(Object),
            whenCreated: expect.any(Object),
            portfolio: expect.any(Object),
          })
        );
      });

      it('passing ITasker should create a new form with FormGroup', () => {
        const formGroup = service.createTaskerFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            phoneNumber: expect.any(Object),
            validation: expect.any(Object),
            whenCreated: expect.any(Object),
            portfolio: expect.any(Object),
          })
        );
      });
    });

    describe('getTasker', () => {
      it('should return NewTasker for default Tasker initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createTaskerFormGroup(sampleWithNewData);

        const tasker = service.getTasker(formGroup) as any;

        expect(tasker).toMatchObject(sampleWithNewData);
      });

      it('should return NewTasker for empty Tasker initial value', () => {
        const formGroup = service.createTaskerFormGroup();

        const tasker = service.getTasker(formGroup) as any;

        expect(tasker).toMatchObject({});
      });

      it('should return ITasker', () => {
        const formGroup = service.createTaskerFormGroup(sampleWithRequiredData);

        const tasker = service.getTasker(formGroup) as any;

        expect(tasker).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ITasker should not enable id FormControl', () => {
        const formGroup = service.createTaskerFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewTasker should disable id FormControl', () => {
        const formGroup = service.createTaskerFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
