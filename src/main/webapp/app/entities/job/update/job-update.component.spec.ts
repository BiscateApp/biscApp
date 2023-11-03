import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { JobFormService } from './job-form.service';
import { JobService } from '../service/job.service';
import { IJob } from '../job.model';
import { IAddress } from 'app/entities/address/address.model';
import { AddressService } from 'app/entities/address/service/address.service';
import { IJobDescriptor } from 'app/entities/job-descriptor/job-descriptor.model';
import { JobDescriptorService } from 'app/entities/job-descriptor/service/job-descriptor.service';
import { ITasker } from 'app/entities/tasker/tasker.model';
import { TaskerService } from 'app/entities/tasker/service/tasker.service';

import { JobUpdateComponent } from './job-update.component';

describe('Job Management Update Component', () => {
  let comp: JobUpdateComponent;
  let fixture: ComponentFixture<JobUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let jobFormService: JobFormService;
  let jobService: JobService;
  let addressService: AddressService;
  let jobDescriptorService: JobDescriptorService;
  let taskerService: TaskerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), JobUpdateComponent],
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
      .overrideTemplate(JobUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(JobUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    jobFormService = TestBed.inject(JobFormService);
    jobService = TestBed.inject(JobService);
    addressService = TestBed.inject(AddressService);
    jobDescriptorService = TestBed.inject(JobDescriptorService);
    taskerService = TestBed.inject(TaskerService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call location query and add missing value', () => {
      const job: IJob = { id: 456 };
      const location: IAddress = { id: 19038 };
      job.location = location;

      const locationCollection: IAddress[] = [{ id: 8635 }];
      jest.spyOn(addressService, 'query').mockReturnValue(of(new HttpResponse({ body: locationCollection })));
      const expectedCollection: IAddress[] = [location, ...locationCollection];
      jest.spyOn(addressService, 'addAddressToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ job });
      comp.ngOnInit();

      expect(addressService.query).toHaveBeenCalled();
      expect(addressService.addAddressToCollectionIfMissing).toHaveBeenCalledWith(locationCollection, location);
      expect(comp.locationsCollection).toEqual(expectedCollection);
    });

    it('Should call descriptor query and add missing value', () => {
      const job: IJob = { id: 456 };
      const descriptor: IJobDescriptor = { id: 4635 };
      job.descriptor = descriptor;

      const descriptorCollection: IJobDescriptor[] = [{ id: 4581 }];
      jest.spyOn(jobDescriptorService, 'query').mockReturnValue(of(new HttpResponse({ body: descriptorCollection })));
      const expectedCollection: IJobDescriptor[] = [descriptor, ...descriptorCollection];
      jest.spyOn(jobDescriptorService, 'addJobDescriptorToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ job });
      comp.ngOnInit();

      expect(jobDescriptorService.query).toHaveBeenCalled();
      expect(jobDescriptorService.addJobDescriptorToCollectionIfMissing).toHaveBeenCalledWith(descriptorCollection, descriptor);
      expect(comp.descriptorsCollection).toEqual(expectedCollection);
    });

    it('Should call Tasker query and add missing value', () => {
      const job: IJob = { id: 456 };
      const jobDoer: ITasker = { id: 26454 };
      job.jobDoer = jobDoer;

      const taskerCollection: ITasker[] = [{ id: 2660 }];
      jest.spyOn(taskerService, 'query').mockReturnValue(of(new HttpResponse({ body: taskerCollection })));
      const additionalTaskers = [jobDoer];
      const expectedCollection: ITasker[] = [...additionalTaskers, ...taskerCollection];
      jest.spyOn(taskerService, 'addTaskerToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ job });
      comp.ngOnInit();

      expect(taskerService.query).toHaveBeenCalled();
      expect(taskerService.addTaskerToCollectionIfMissing).toHaveBeenCalledWith(
        taskerCollection,
        ...additionalTaskers.map(expect.objectContaining)
      );
      expect(comp.taskersSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const job: IJob = { id: 456 };
      const location: IAddress = { id: 30237 };
      job.location = location;
      const descriptor: IJobDescriptor = { id: 23196 };
      job.descriptor = descriptor;
      const jobDoer: ITasker = { id: 19228 };
      job.jobDoer = jobDoer;

      activatedRoute.data = of({ job });
      comp.ngOnInit();

      expect(comp.locationsCollection).toContain(location);
      expect(comp.descriptorsCollection).toContain(descriptor);
      expect(comp.taskersSharedCollection).toContain(jobDoer);
      expect(comp.job).toEqual(job);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IJob>>();
      const job = { id: 123 };
      jest.spyOn(jobFormService, 'getJob').mockReturnValue(job);
      jest.spyOn(jobService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ job });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: job }));
      saveSubject.complete();

      // THEN
      expect(jobFormService.getJob).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(jobService.update).toHaveBeenCalledWith(expect.objectContaining(job));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IJob>>();
      const job = { id: 123 };
      jest.spyOn(jobFormService, 'getJob').mockReturnValue({ id: null });
      jest.spyOn(jobService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ job: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: job }));
      saveSubject.complete();

      // THEN
      expect(jobFormService.getJob).toHaveBeenCalled();
      expect(jobService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IJob>>();
      const job = { id: 123 };
      jest.spyOn(jobService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ job });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(jobService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareAddress', () => {
      it('Should forward to addressService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(addressService, 'compareAddress');
        comp.compareAddress(entity, entity2);
        expect(addressService.compareAddress).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareJobDescriptor', () => {
      it('Should forward to jobDescriptorService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(jobDescriptorService, 'compareJobDescriptor');
        comp.compareJobDescriptor(entity, entity2);
        expect(jobDescriptorService.compareJobDescriptor).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareTasker', () => {
      it('Should forward to taskerService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(taskerService, 'compareTasker');
        comp.compareTasker(entity, entity2);
        expect(taskerService.compareTasker).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
