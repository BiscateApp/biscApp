import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ITasker } from '../tasker.model';
import { TaskerService } from '../service/tasker.service';

export const taskerResolve = (route: ActivatedRouteSnapshot): Observable<null | ITasker> => {
  const id = route.params['id'];
  if (id) {
    return inject(TaskerService)
      .find(id)
      .pipe(
        mergeMap((tasker: HttpResponse<ITasker>) => {
          if (tasker.body) {
            return of(tasker.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        })
      );
  }
  return of(null);
};

export default taskerResolve;
