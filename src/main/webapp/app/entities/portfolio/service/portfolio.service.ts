import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IPortfolio, NewPortfolio } from '../portfolio.model';

export type PartialUpdatePortfolio = Partial<IPortfolio> & Pick<IPortfolio, 'id'>;

export type EntityResponseType = HttpResponse<IPortfolio>;
export type EntityArrayResponseType = HttpResponse<IPortfolio[]>;

@Injectable({ providedIn: 'root' })
export class PortfolioService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/portfolios');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(portfolio: NewPortfolio): Observable<EntityResponseType> {
    return this.http.post<IPortfolio>(this.resourceUrl, portfolio, { observe: 'response' });
  }

  update(portfolio: IPortfolio): Observable<EntityResponseType> {
    return this.http.put<IPortfolio>(`${this.resourceUrl}/${this.getPortfolioIdentifier(portfolio)}`, portfolio, { observe: 'response' });
  }

  partialUpdate(portfolio: PartialUpdatePortfolio): Observable<EntityResponseType> {
    return this.http.patch<IPortfolio>(`${this.resourceUrl}/${this.getPortfolioIdentifier(portfolio)}`, portfolio, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IPortfolio>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IPortfolio[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getPortfolioIdentifier(portfolio: Pick<IPortfolio, 'id'>): number {
    return portfolio.id;
  }

  comparePortfolio(o1: Pick<IPortfolio, 'id'> | null, o2: Pick<IPortfolio, 'id'> | null): boolean {
    return o1 && o2 ? this.getPortfolioIdentifier(o1) === this.getPortfolioIdentifier(o2) : o1 === o2;
  }

  addPortfolioToCollectionIfMissing<Type extends Pick<IPortfolio, 'id'>>(
    portfolioCollection: Type[],
    ...portfoliosToCheck: (Type | null | undefined)[]
  ): Type[] {
    const portfolios: Type[] = portfoliosToCheck.filter(isPresent);
    if (portfolios.length > 0) {
      const portfolioCollectionIdentifiers = portfolioCollection.map(portfolioItem => this.getPortfolioIdentifier(portfolioItem)!);
      const portfoliosToAdd = portfolios.filter(portfolioItem => {
        const portfolioIdentifier = this.getPortfolioIdentifier(portfolioItem);
        if (portfolioCollectionIdentifiers.includes(portfolioIdentifier)) {
          return false;
        }
        portfolioCollectionIdentifiers.push(portfolioIdentifier);
        return true;
      });
      return [...portfoliosToAdd, ...portfolioCollection];
    }
    return portfolioCollection;
  }
}
