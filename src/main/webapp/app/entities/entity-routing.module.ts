import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'portfolio',
        data: { pageTitle: 'biscApp.portfolio.home.title' },
        loadChildren: () => import('./portfolio/portfolio.routes'),
      },
      {
        path: 'job-descriptor',
        data: { pageTitle: 'biscApp.jobDescriptor.home.title' },
        loadChildren: () => import('./job-descriptor/job-descriptor.routes'),
      },
      {
        path: 'tasker',
        data: { pageTitle: 'biscApp.tasker.home.title' },
        loadChildren: () => import('./tasker/tasker.routes'),
      },
      {
        path: 'address',
        data: { pageTitle: 'biscApp.address.home.title' },
        loadChildren: () => import('./address/address.routes'),
      },
      {
        path: 'job',
        data: { pageTitle: 'biscApp.job.home.title' },
        loadChildren: () => import('./job/job.routes'),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
