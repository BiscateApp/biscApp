import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { PortfolioComponent } from './list/portfolio.component';
import { PortfolioDetailComponent } from './detail/portfolio-detail.component';
import { PortfolioUpdateComponent } from './update/portfolio-update.component';
import PortfolioResolve from './route/portfolio-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const portfolioRoute: Routes = [
  {
    path: '',
    component: PortfolioComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: PortfolioDetailComponent,
    resolve: {
      portfolio: PortfolioResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: PortfolioUpdateComponent,
    resolve: {
      portfolio: PortfolioResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: PortfolioUpdateComponent,
    resolve: {
      portfolio: PortfolioResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default portfolioRoute;
