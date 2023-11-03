import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { JobDescriptorService } from '../service/job-descriptor.service';

import { JobDescriptorComponent } from './job-descriptor.component';

describe('JobDescriptor Management Component', () => {
  let comp: JobDescriptorComponent;
  let fixture: ComponentFixture<JobDescriptorComponent>;
  let service: JobDescriptorService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([{ path: 'job-descriptor', component: JobDescriptorComponent }]),
        HttpClientTestingModule,
        JobDescriptorComponent,
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            data: of({
              defaultSort: 'id,asc',
            }),
            queryParamMap: of(
              jest.requireActual('@angular/router').convertToParamMap({
                page: '1',
                size: '1',
                sort: 'id,desc',
              })
            ),
            snapshot: { queryParams: {} },
          },
        },
      ],
    })
      .overrideTemplate(JobDescriptorComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(JobDescriptorComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(JobDescriptorService);

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ id: 123 }],
          headers,
        })
      )
    );
  });

  it('Should call load all on init', () => {
    // WHEN
    comp.ngOnInit();

    // THEN
    expect(service.query).toHaveBeenCalled();
    expect(comp.jobDescriptors?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to jobDescriptorService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getJobDescriptorIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getJobDescriptorIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
