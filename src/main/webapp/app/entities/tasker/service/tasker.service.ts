import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { map } from 'rxjs/operators';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ITasker, NewTasker } from '../tasker.model';

export type PartialUpdateTasker = Partial<ITasker> & Pick<ITasker, 'id'>;

type RestOf<T extends ITasker | NewTasker> = Omit<T, 'whenCreated'> & {
  whenCreated?: string | null;
};

export type RestTasker = RestOf<ITasker>;

export type NewRestTasker = RestOf<NewTasker>;

export type PartialUpdateRestTasker = RestOf<PartialUpdateTasker>;

export type EntityResponseType = HttpResponse<ITasker>;
export type EntityArrayResponseType = HttpResponse<ITasker[]>;

@Injectable({ providedIn: 'root' })
export class TaskerService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/taskers');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(tasker: NewTasker): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(tasker);
    return this.http
      .post<RestTasker>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(tasker: ITasker): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(tasker);
    return this.http
      .put<RestTasker>(`${this.resourceUrl}/${this.getTaskerIdentifier(tasker)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(tasker: PartialUpdateTasker): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(tasker);
    return this.http
      .patch<RestTasker>(`${this.resourceUrl}/${this.getTaskerIdentifier(tasker)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestTasker>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestTasker[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
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

  protected convertDateFromClient<T extends ITasker | NewTasker | PartialUpdateTasker>(tasker: T): RestOf<T> {
    return {
      ...tasker,
      whenCreated: tasker.whenCreated?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restTasker: RestTasker): ITasker {
    return {
      ...restTasker,
      whenCreated: restTasker.whenCreated ? dayjs(restTasker.whenCreated) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestTasker>): HttpResponse<ITasker> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestTasker[]>): HttpResponse<ITasker[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
