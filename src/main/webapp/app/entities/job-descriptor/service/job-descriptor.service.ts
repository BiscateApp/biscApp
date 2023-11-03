import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IJobDescriptor, NewJobDescriptor } from '../job-descriptor.model';

export type PartialUpdateJobDescriptor = Partial<IJobDescriptor> & Pick<IJobDescriptor, 'id'>;

export type EntityResponseType = HttpResponse<IJobDescriptor>;
export type EntityArrayResponseType = HttpResponse<IJobDescriptor[]>;

@Injectable({ providedIn: 'root' })
export class JobDescriptorService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/job-descriptors');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(jobDescriptor: NewJobDescriptor): Observable<EntityResponseType> {
    return this.http.post<IJobDescriptor>(this.resourceUrl, jobDescriptor, { observe: 'response' });
  }

  update(jobDescriptor: IJobDescriptor): Observable<EntityResponseType> {
    return this.http.put<IJobDescriptor>(`${this.resourceUrl}/${this.getJobDescriptorIdentifier(jobDescriptor)}`, jobDescriptor, {
      observe: 'response',
    });
  }

  partialUpdate(jobDescriptor: PartialUpdateJobDescriptor): Observable<EntityResponseType> {
    return this.http.patch<IJobDescriptor>(`${this.resourceUrl}/${this.getJobDescriptorIdentifier(jobDescriptor)}`, jobDescriptor, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IJobDescriptor>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IJobDescriptor[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getJobDescriptorIdentifier(jobDescriptor: Pick<IJobDescriptor, 'id'>): number {
    return jobDescriptor.id;
  }

  compareJobDescriptor(o1: Pick<IJobDescriptor, 'id'> | null, o2: Pick<IJobDescriptor, 'id'> | null): boolean {
    return o1 && o2 ? this.getJobDescriptorIdentifier(o1) === this.getJobDescriptorIdentifier(o2) : o1 === o2;
  }

  addJobDescriptorToCollectionIfMissing<Type extends Pick<IJobDescriptor, 'id'>>(
    jobDescriptorCollection: Type[],
    ...jobDescriptorsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const jobDescriptors: Type[] = jobDescriptorsToCheck.filter(isPresent);
    if (jobDescriptors.length > 0) {
      const jobDescriptorCollectionIdentifiers = jobDescriptorCollection.map(
        jobDescriptorItem => this.getJobDescriptorIdentifier(jobDescriptorItem)!
      );
      const jobDescriptorsToAdd = jobDescriptors.filter(jobDescriptorItem => {
        const jobDescriptorIdentifier = this.getJobDescriptorIdentifier(jobDescriptorItem);
        if (jobDescriptorCollectionIdentifiers.includes(jobDescriptorIdentifier)) {
          return false;
        }
        jobDescriptorCollectionIdentifiers.push(jobDescriptorIdentifier);
        return true;
      });
      return [...jobDescriptorsToAdd, ...jobDescriptorCollection];
    }
    return jobDescriptorCollection;
  }
}
