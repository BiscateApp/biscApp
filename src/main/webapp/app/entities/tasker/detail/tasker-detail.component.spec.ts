import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness, RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { TaskerDetailComponent } from './tasker-detail.component';

describe('Tasker Management Detail Component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskerDetailComponent, RouterTestingModule.withRoutes([], { bindToComponentInputs: true })],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: TaskerDetailComponent,
              resolve: { tasker: () => of({ id: 123 }) },
            },
          ],
          withComponentInputBinding()
        ),
      ],
    })
      .overrideTemplate(TaskerDetailComponent, '')
      .compileComponents();
  });

  describe('OnInit', () => {
    it('Should load tasker on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', TaskerDetailComponent);

      // THEN
      expect(instance.tasker).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
