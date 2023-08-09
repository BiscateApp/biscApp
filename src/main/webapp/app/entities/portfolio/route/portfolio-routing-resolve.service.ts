import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IPortfolio } from '../portfolio.model';
import { PortfolioService } from '../service/portfolio.service';

export const portfolioResolve = (route: ActivatedRouteSnapshot): Observable<null | IPortfolio> => {
  const id = route.params['id'];
  if (id) {
    return inject(PortfolioService)
      .find(id)
      .pipe(
        mergeMap((portfolio: HttpResponse<IPortfolio>) => {
          if (portfolio.body) {
            return of(portfolio.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        })
      );
  }
  return of(null);
};

export default portfolioResolve;
