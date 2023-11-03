import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IJobDescriptor } from '../job-descriptor.model';
import { JobDescriptorService } from '../service/job-descriptor.service';

export const jobDescriptorResolve = (route: ActivatedRouteSnapshot): Observable<null | IJobDescriptor> => {
  const id = route.params['id'];
  if (id) {
    return inject(JobDescriptorService)
      .find(id)
      .pipe(
        mergeMap((jobDescriptor: HttpResponse<IJobDescriptor>) => {
          if (jobDescriptor.body) {
            return of(jobDescriptor.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        })
      );
  }
  return of(null);
};

export default jobDescriptorResolve;
