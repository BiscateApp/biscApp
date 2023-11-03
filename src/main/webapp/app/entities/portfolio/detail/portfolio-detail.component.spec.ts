import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness, RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { PortfolioDetailComponent } from './portfolio-detail.component';

describe('Portfolio Management Detail Component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PortfolioDetailComponent, RouterTestingModule.withRoutes([], { bindToComponentInputs: true })],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: PortfolioDetailComponent,
              resolve: { portfolio: () => of({ id: 123 }) },
            },
          ],
          withComponentInputBinding()
        ),
      ],
    })
      .overrideTemplate(PortfolioDetailComponent, '')
      .compileComponents();
  });

  describe('OnInit', () => {
    it('Should load portfolio on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', PortfolioDetailComponent);

      // THEN
      expect(instance.portfolio).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
