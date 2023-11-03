import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ITasker, NewTasker } from '../tasker.model';

export type PartialUpdateTasker = Partial<ITasker> & Pick<ITasker, 'id'>;

export type EntityResponseType = HttpResponse<ITasker>;
export type EntityArrayResponseType = HttpResponse<ITasker[]>;

@Injectable({ providedIn: 'root' })
export class TaskerService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/taskers');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(tasker: NewTasker): Observable<EntityResponseType> {
    return this.http.post<ITasker>(this.resourceUrl, tasker, { observe: 'response' });
  }

  update(tasker: ITasker): Observable<EntityResponseType> {
    return this.http.put<ITasker>(`${this.resourceUrl}/${this.getTaskerIdentifier(tasker)}`, tasker, { observe: 'response' });
  }

  partialUpdate(tasker: PartialUpdateTasker): Observable<EntityResponseType> {
    return this.http.patch<ITasker>(`${this.resourceUrl}/${this.getTaskerIdentifier(tasker)}`, tasker, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ITasker>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ITasker[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getTaskerIdentifier(tasker: Pick<ITasker, 'id'>): number {
    return tasker.id;
  }

  compareTasker(o1: Pick<ITasker, 'id'> | null, o2: Pick<ITasker, 'id'> | null): boolean {
    return o1 && o2 ? this.getTaskerIdentifier(o1) === this.getTaskerIdentifier(o2) : o1 === o2;
  }

  addTaskerToCollectionIfMissing<Type extends Pick<ITasker, 'id'>>(
    taskerCollection: Type[],
    ...taskersToCheck: (Type | null | undefined)[]
  ): Type[] {
    const taskers: Type[] = taskersToCheck.filter(isPresent);
    if (taskers.length > 0) {
      const taskerCollectionIdentifiers = taskerCollection.map(taskerItem => this.getTaskerIdentifier(taskerItem)!);
      const taskersToAdd = taskers.filter(taskerItem => {
        const taskerIdentifier = this.getTaskerIdentifier(taskerItem);
        if (taskerCollectionIdentifiers.includes(taskerIdentifier)) {
          return false;
        }
        taskerCollectionIdentifiers.push(taskerIdentifier);
        return true;
      });
      return [...taskersToAdd, ...taskerCollection];
    }
    return taskerCollection;
  }
}
