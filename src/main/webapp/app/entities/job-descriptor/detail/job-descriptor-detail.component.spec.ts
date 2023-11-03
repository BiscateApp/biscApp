import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness, RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { JobDescriptorDetailComponent } from './job-descriptor-detail.component';

describe('JobDescriptor Management Detail Component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JobDescriptorDetailComponent, RouterTestingModule.withRoutes([], { bindToComponentInputs: true })],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: JobDescriptorDetailComponent,
              resolve: { jobDescriptor: () => of({ id: 123 }) },
            },
          ],
          withComponentInputBinding()
        ),
      ],
    })
      .overrideTemplate(JobDescriptorDetailComponent, '')
      .compileComponents();
  });

  describe('OnInit', () => {
    it('Should load jobDescriptor on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', JobDescriptorDetailComponent);

      // THEN
      expect(instance.jobDescriptor).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
