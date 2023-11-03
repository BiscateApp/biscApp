import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { JobDescriptorComponent } from './list/job-descriptor.component';
import { JobDescriptorDetailComponent } from './detail/job-descriptor-detail.component';
import { JobDescriptorUpdateComponent } from './update/job-descriptor-update.component';
import JobDescriptorResolve from './route/job-descriptor-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const jobDescriptorRoute: Routes = [
  {
    path: '',
    component: JobDescriptorComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: JobDescriptorDetailComponent,
    resolve: {
      jobDescriptor: JobDescriptorResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: JobDescriptorUpdateComponent,
    resolve: {
      jobDescriptor: JobDescriptorResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: JobDescriptorUpdateComponent,
    resolve: {
      jobDescriptor: JobDescriptorResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default jobDescriptorRoute;
