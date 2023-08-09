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
        path: 'client',
        data: { pageTitle: 'biscApp.client.home.title' },
        loadChildren: () => import('./client/client.routes'),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
