import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { TaskerComponent } from './list/tasker.component';
import { TaskerDetailComponent } from './detail/tasker-detail.component';
import { TaskerUpdateComponent } from './update/tasker-update.component';
import TaskerResolve from './route/tasker-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const taskerRoute: Routes = [
  {
    path: '',
    component: TaskerComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: TaskerDetailComponent,
    resolve: {
      tasker: TaskerResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: TaskerUpdateComponent,
    resolve: {
      tasker: TaskerResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: TaskerUpdateComponent,
    resolve: {
      tasker: TaskerResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default taskerRoute;
